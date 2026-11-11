#include "ServerMangaer.h"
#include <stdexcept>
#include <iostream>
#include <openssl/ssl.h>
#include "ProxyHandler.h"
#include <unistd.h>

ServerMangaer::ServerMangaer(Server& server,ProxyHandler& proxyHandler ,int portNumber, size_t workers) :
	_server(&server),
	_proxyHandler(&proxyHandler),
	_workers(workers),
	_portNumber(portNumber),
	_stop(false)
{
	if(portNumber < 1 || portNumber > 65535) {
		throw std::runtime_error("Invalid port.");
	}
	if(_workers < 1) {
		throw std::runtime_error("Invalid number of workers.");
	}
	initServer();
}

ServerMangaer::~ServerMangaer()
{
	{
	std::lock_guard<std::mutex> lock(_queue_mutex);
	_stop = true;
	}
	_cv.notify_all();
	for (auto& thread : _threads) {
		if (thread.joinable()) {
			thread.join();
		}
	}
}	

void ServerMangaer::initServer() {
	_server->createSocket();
	_server->bindSocket();
	_server->initializeTLS();
	_server->listenSocket();
	_threads.reserve(_workers);
	_isServerRunnung = true;
	if (!_server) {
		throw std::runtime_error("Server is not initialized.");
	}
	for (size_t i = 0; i < _workers; i++) {
		_threads.emplace_back([this]() {
			while (_isServerRunnung) {
				std::function<void()> task;
				{
					std::unique_lock<std::mutex> lock(_queue_mutex);
					this->_cv.wait(lock, [this]() {
						return this->_stop || !this->_taskQueue.empty();
						});
					if (this->_stop && this->_taskQueue.empty())
						return;
					task = std::move(this->_taskQueue.front());
					this->_taskQueue.pop();
				}
				task();
			}
			}); 
		}

}

void ServerMangaer::addTask(std::function<void()> task) {
	{
		std::unique_lock<std::mutex> lock(_queue_mutex);
		_taskQueue.push(std::move(task));
	}
	_cv.notify_one();
}	

void ServerMangaer::accept() {
	if (!_isServerRunnung) {
		initServer();
	}
	std::cout << "Start Serving at HTTPs At port\t" << _portNumber << std::endl;
	while (true) {
		int task = _server->acceptSocket();

		if (task < 0) {
			return;
		}
		addTask([this, task]() {
			SSL* ssl = nullptr;
			try {
				ssl = this->_server->acceptTLS(task);
				if (!ssl) {
					close(task);
					return;
				}
				if (!_proxyHandler) {
					throw std::runtime_error("ProxyHandler is not initialized.");
				}
				_proxyHandler->handle(ssl);

			}
			catch (const std::exception& e) {
				std::cerr << "Connection error: " << e.what() << '\n';
			}
			if (ssl) {
				SSL_shutdown(ssl);
				SSL_free(ssl);
			}
			close(task);

		});
	}
}
		






