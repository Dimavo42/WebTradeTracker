#include <iostream>
#include <csignal>
#include <cstdlib>
#include <string>
#include <filesystem>
#include "common/ProxyHandler.h"
#include "common/Server.h"
#include "common/Utilities.h"
#include "common/ServerMangaer.h"


int main(int argc,char * argv[]) {
    // On Linux, writing to a socket the client already closed raises SIGPIPE,
    // which kills the whole process by default. Ignore it and handle the error instead.
    std::signal(SIGPIPE, SIG_IGN);
    const char* hostEnv = std::getenv("SERVER_HOST");
    const char* portEnv = std::getenv("SERVER_PORT");
    const char* upStreamHostEnv = std::getenv("UPSTREAM_HOST");
    const char* upStreamPortEnv = std::getenv("UPSTREAM_PORT");
    const char* keysSizeEnv = std::getenv("KEYS_SIZE");
    const char* workersEnv = std::getenv("WORKERS");
    const char* host = hostEnv ? hostEnv : "0.0.0.0";
    const int port = portEnv ? std::stoi(portEnv) : 8080;
    const char* upStreamHost = upStreamHostEnv ? upStreamHostEnv : "127.0.0.1";
    const int upStreamPort = upStreamPortEnv ? std::stoi(upStreamPortEnv) : 80;
    const size_t workers = workersEnv ? std::stoul(workersEnv) : 4;
    const int keySize = keysSizeEnv ? std::stoul(keysSizeEnv) :2048;
    // Folder for the key + certificate. In Docker this is a volume, so they survive restarts.
    const char* certDirEnv = std::getenv("CERT_DIR");
    const std::filesystem::path certDir = certDirEnv ? certDirEnv : ".";
    const std::string keyPath = (certDir / "server.key").string();
    const std::string pubPath = (certDir / "server.pub.pem").string();
    const std::string certPath = (certDir / "server.crt").string();

    try {
        if (std::filesystem::exists(keyPath) && std::filesystem::exists(certPath)) {
            std::cout << "Using existing certificate: " << certPath << std::endl;
        }
        else {
            std::filesystem::create_directories(certDir);
            auto keys = Utilities::generateKeys(keySize);
            Utilities::savePrivateKey(keyPath, keys);
            Utilities::savePublicKey(pubPath, keys);
            Utilities::saveCertificate(certPath, keys);
            std::cout << "Generated new certificate: " << certPath << std::endl;
        }
        Server server(host, port, certPath, keyPath);
        ProxyHandler proxyHandler(upStreamHost, upStreamPort);
        ServerMangaer manager(server, proxyHandler, port, workers);
        manager.accept();
    }
    catch (const std::exception& e) {
        std::cerr << "Fatal: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}
