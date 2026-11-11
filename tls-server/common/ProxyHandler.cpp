#include "ProxyHandler.h"
#include <stdexcept>
#include <openssl/ssl.h>
#include <string>
#include "SocketGuard.h"
#include <algorithm>
#include <cctype>
#include <unordered_map>
#include <system_error>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <cerrno>
#include <cstring>


ProxyHandler::ProxyHandler(const char * address, int port) :_address(address), _port(port)
{
}

void ProxyHandler::handle(SSL* clientSsl)
{
	HttpRequest request = getHttpRequest(clientSsl);
	// 2. Connect to Vite and ensure cleanup on every exit path.
	prepareUpstreamHeaders(request);
	SocketGuard appSocket{ connectToApp() };
	const std::string serialized = serializeRequest(request);
	//SendAllToSocket
	sendAll(appSocket.getSocket(), serialized);
	forwardCompleteResponse(appSocket.getSocket(), clientSsl);


}

void ProxyHandler::writeToSSL(SSL* clientSsl, const char* data, size_t length) {
	size_t offset = 0;
	while (offset < length) {
		size_t  amount = static_cast<size_t>(
			(std::min)(length - offset, size_t(MAX_BUFFER_SIZE))
			);

		int n = SSL_write(clientSsl, data + offset, static_cast<int>(amount));

		if (n <= 0) {
			int error = SSL_get_error(clientSsl, n);

			throw std::runtime_error(
				"SSL_write failed: " + std::to_string(error)
			);
		}
		offset += static_cast<size_t>(n);
	}
}

std::string ProxyHandler::serializeRequest(HttpRequest& request)
{
	std::string result = request.requestLine + "\r\n";
	for (const auto&value : request.headers) {
		result += value.first + ": " + value.second + "\r\n";
	}
	result += "\r\n";
	result += request.body;
	return result;
}

void ProxyHandler::prepareUpstreamHeaders(HttpRequest& request)
{
	request.headers.erase("keep-alive");
	request.headers.erase("connection");
	// Ask Vite to close its connection after sending the response.
	request.headers["connection"] = "close";
	// Identify the upstream destination, for example localhost:5173.
	request.headers["host"] =
		_address + ":" + std::to_string(_port);
}

void ProxyHandler::sendAll(int socket, const std::string& request)
{
    std::size_t offset = 0;

    while (offset < request.size()) {
        const std::size_t amount = std::min(
            request.size() - offset,
            static_cast<std::size_t>(MAX_BUFFER_SIZE)
        );

        const ssize_t n = ::send(
            socket, request.data() + offset, amount, MSG_NOSIGNAL
        );

        if (n == -1) {
            const int error = errno;
            if (error == EINTR) {
                continue; // Retry from the same offset.
            }
            throw std::system_error(error, std::generic_category(), "send");
        }
        if (n == 0) {
            throw std::runtime_error("send made no progress");
        }
        offset += static_cast<std::size_t>(n);
    }
}

void ProxyHandler::forwardCompleteResponse(int appSocket, SSL* clientSsl)
{
    char buffer[MAX_BUFFER_SIZE];

    while (true) {
        const ssize_t received = ::recv(appSocket, buffer, sizeof(buffer), 0);

        if (received == -1) {
            const int error = errno;
            if (error == EINTR) {
                continue; // Interrupted by a signal, so retry.
            }

            throw std::system_error(error, std::generic_category(), "recv");
        }

        if (received == 0) {
            return; // Upstream closed its side of the connection.
        }

        writeToSSL(clientSsl, buffer, static_cast<std::size_t>(received));
    }
}

int ProxyHandler::connectToApp()
{
    addrinfo hints{};
    hints.ai_family = AF_UNSPEC;
    hints.ai_socktype = SOCK_STREAM;

    addrinfo* results = nullptr;
    const std::string port = std::to_string(_port);
    const int status = getaddrinfo(_address.c_str(), port.c_str(), &hints, &results);
    if (status != 0) {
        throw std::runtime_error("Cannot resolve upstream " + _address + ": " + gai_strerror(status));
    }

    int lastError = 0;
    for (addrinfo* entry = results; entry != nullptr; entry = entry->ai_next) {
        const int appSocket = socket(entry->ai_family, entry->ai_socktype, entry->ai_protocol);
        if (appSocket == -1) {
            lastError = errno;
            continue;
        }
        if (connect(appSocket, entry->ai_addr, entry->ai_addrlen) == 0) {
            freeaddrinfo(results);
            return appSocket;
        }
        lastError = errno;
        close(appSocket);
    }

    freeaddrinfo(results);
    throw std::system_error(lastError, std::generic_category(), "connect to upstream " + _address + ":" + port);
}

 HttpRequest ProxyHandler::getHttpRequest(SSL* clientSsl)
{
	 char buffer[MAX_BUFFER_SIZE];
	 HttpRequest request{};
	 std::string rawData{};
	 size_t headerEndPos = std::string::npos;
	 // === STAGE 1: Read until we find the end of the headers (\r\n\r\n) ===
	 while ((headerEndPos = rawData.find("\r\n\r\n")) == std::string::npos)
	 {
		 int received = SSL_read(clientSsl, buffer, sizeof(buffer));
		 if (received <= 0) {
			 throw std::runtime_error("SSL_read failed during header read");
		 }
		 rawData.append(buffer, static_cast<size_t>(received));
		 if (rawData.size() > MAX_HEADER_SIZE)
		 {
			 throw std::runtime_error("Headers too large");
		 }
	 }
	 size_t postion = rawData.find("\r\n");
	 if(postion == std::string::npos){
		throw std::runtime_error("Invalid request format.");
	  }
	 request.requestLine = rawData.substr(0, postion);
	 postion += 2; // Move past the "\r\n"
	 while (postion < rawData.size()) {
		 size_t nextPos = rawData.find("\r\n", postion);
		 if (nextPos == std::string::npos) 
				{
			 		break; // No more headers
			 	}
		if (nextPos == postion) 
				{
			 		break; //Empty header
			 	}
		std::string headerLine = rawData.substr(postion, nextPos - postion);
		size_t colonPos = headerLine.find(":");
			if (colonPos == std::string::npos || colonPos == 0) {
				throw std::runtime_error("Invalid request format.");
			}
		std::string key = headerLine.substr(0, colonPos);
		std::string value = headerLine.substr(colonPos + 1);
		std::transform(
			key.begin(), key.end(), key.begin(),
			[](unsigned char c) {
				return static_cast<char>(std::tolower(c));
			}
		);
		size_t first = value.find_first_not_of(" \t");
		size_t last = value.find_last_not_of(" \t");
		value = first == std::string::npos ? "" : value.substr(first, last - first + 1);
		request.headers[key] = value;
		postion = nextPos + 2; // Move past the "\r\n"
	 }
	 //Read Reaming body
	 auto contentLengthAsString = request.headers.find("content-length");
	 if (contentLengthAsString == request.headers.end()) {
		 return request;
		 //GET REQUEST
	 }
	 size_t contentLength = std::stoi(contentLengthAsString->second);
	 size_t bodyStart = headerEndPos + 4;
	 size_t bodyBytesReadSoFar = rawData.size() - bodyStart;
	 while (bodyBytesReadSoFar < contentLength) {
		 const size_t remaining = contentLength - bodyBytesReadSoFar;
		 size_t  bytesToRead = static_cast<size_t>(
			 (std::min)(remaining, MAX_BUFFER_SIZE)
			 );
		 int received = SSL_read(clientSsl, buffer, static_cast<int>(bytesToRead));
		 if (received <= 0) {
			 throw std::runtime_error("SSL_read failed during body read");
		 }
		 rawData.append(buffer, static_cast<size_t>(received));
		 bodyBytesReadSoFar += static_cast<size_t>(received);
	 }
	 request.body = rawData.substr(bodyStart, contentLength);
	 return request;
}

std::string ProxyHandler::FromMapToString(std::map<std::string, std::string>& headers) {
	auto startLine = headers.find("Request-Line");

	if (startLine == headers.end()) {
		throw std::runtime_error("HTTP start line is missing.");
	}
	std::string result = startLine->second + "\r\n";
	for (auto& key : headers) {
		if (key.first != "Request-Line")
		{
			result.append(key.first + ": " + key.second + "\r\n");
		}
	}
	result.append("\r\n");
	return result;
}


