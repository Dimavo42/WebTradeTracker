#pragma once
#include <string>
#include <openssl/types.h>


class Server{
    public:
     Server(const char *address,int port,
            std::string certFile = "server.crt",
            std::string keyFile = "server.key");
     ~Server();
     bool createSocket();
     void bindSocket();
     void listenSocket();
     int acceptSocket();
     void initializeTLS();
     SSL* acceptTLS(int clientSocket);

     private:
        int _port;
        const char * _address;
        int _server_fd;
        std::string _certFile;
        std::string _keyFile;
        SSL_CTX* _tlscContext = nullptr;
    

};