#include "Server.h"
#include <sys/socket.h>
#include <iostream>
#include <sys/socket.h>
#include <unistd.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <stdexcept>

Server::Server(const char * address,int port,std::string certFile,std::string keyFile)
    :_port(port),_address(address),_server_fd(-1),
     _certFile(std::move(certFile)),_keyFile(std::move(keyFile)){}

Server::~Server(){
    if(_server_fd >=0)
    {
        close(_server_fd);
    }
}

bool Server::createSocket(){
    _server_fd = socket(AF_INET,SOCK_STREAM,0);
    if(_server_fd < 0){
        std::cout<<"Error in creating socket"<<std::endl;
        return false;
    }
    return true;

}

void Server::bindSocket(){
    if(_server_fd< 0){
        throw::std::runtime_error("Error in creating socket");
    }
    if(_port < 1024 || _port >65535 ){
        std::cout<<"Error in port number"<<std::endl;
    }
    int reuse = 1;
    setsockopt(_server_fd, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));
    sockaddr_in address{};
    address.sin_family = AF_INET;
    address.sin_port = htons(_port);
    //Translate The address to binary form
    if (inet_pton(AF_INET, _address, &address.sin_addr) <= 0) {
        throw std::runtime_error("Cannot bind the socket invalid address");
    }
    if(bind(_server_fd,(sockaddr*)&address,sizeof(address))<0){
        throw std::runtime_error("Cannot bind the socket");
    }
}

int Server::acceptSocket(){
    if(_server_fd < 0){ 
        std::cout<<"Error in accept socket"<<std::endl;
    }
    return accept(_server_fd,NULL,NULL);
}

void Server::listenSocket(){
    if(_server_fd < 0){
        throw::std::runtime_error("Error in creating socket");
    }
    if(listen(_server_fd,10)<0){
        std::cout<<"Error in listening socket"<<std::endl;
    }
}


void Server::initializeTLS()
{
    if (_tlscContext) {
        return;
    }
    SSL_CTX* ctx = SSL_CTX_new(TLS_server_method());
    if (!ctx) {
        throw std::runtime_error("Cannot create TLS context.");
    }
    if (SSL_CTX_set_min_proto_version(ctx, TLS1_2_VERSION) != 1 ||
        SSL_CTX_use_certificate_chain_file(ctx, _certFile.c_str()) != 1 ||
        SSL_CTX_use_PrivateKey_file(ctx, _keyFile.c_str(), SSL_FILETYPE_PEM) != 1 ||
        SSL_CTX_check_private_key(ctx) != 1) {
        SSL_CTX_free(ctx);
        throw std::runtime_error("Cannot configure TLS.");
    }
    _tlscContext = ctx;
}


SSL* Server::acceptTLS(int clientSocket) {
	if (!_tlscContext) {
		throw std::runtime_error("TLS is not init");
	}
	//connects OpenSSL to your existing socket;
	SSL* ssl = SSL_new(_tlscContext);
	if (!ssl) {
		return nullptr;
	}
	if (SSL_set_fd(ssl, static_cast<int>(clientSocket)) != 1) {
		SSL_free(ssl);
		return nullptr;
	}
	int result = SSL_accept(ssl);
	if (result != 1) {
		int error = SSL_get_error(ssl, result);
		// std::endl flushes; with '\n' the message stays buffered and never reaches `docker logs`.
		// The OpenSSL error queue says *why*: e.g. "http request" (client used http://)
		// or "tlsv1 alert unknown ca" / "sslv3 alert certificate unknown" (client rejected our self-signed cert).
		unsigned long detail = ERR_get_error();
		char reason[256] = "unknown";
		if (detail != 0) {
			ERR_error_string_n(detail, reason, sizeof(reason));
		}
		ERR_clear_error();
		std::cerr << "TLS handshake failed (" << error << "): " << reason << std::endl;
		SSL_free(ssl);
		return nullptr;
	}

	return ssl;

}