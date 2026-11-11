#pragma once
#include <openssl/types.h>
#include <string>
#include <iostream>
#include <map>
#include "SocketGuard.h"
#include <unordered_map>


struct HttpRequest {
	std::string requestLine;
	std::unordered_map<std::string, std::string> headers;
	std::string body;
};

class ProxyHandler {
public:
	ProxyHandler(const char * address , int port);
	void handle(SSL* clientSsl);



private:
	int connectToApp();
	HttpRequest getHttpRequest(SSL* clientSsl);
	std::string FromMapToString(std::map<std::string, std::string>& map);
	void writeToSSL(SSL* clientSsl, const char* data, size_t length);
	std::string serializeRequest(HttpRequest& request);
	void prepareUpstreamHeaders(HttpRequest& request);
	void sendAll(int socket, const std::string& request);
	void forwardCompleteResponse(int client, SSL* clientSsl);
	std::string _address;
	int _port;
	static constexpr size_t MAX_HEADER_SIZE = 64 * 1024;
	static constexpr size_t MAX_BUFFER_SIZE = 4096;
};