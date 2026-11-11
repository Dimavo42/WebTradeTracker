#pragma once
#include "Server.h"
#include <vector>
#include <thread>
#include <queue>
#include <functional>
#include <condition_variable>
#include <mutex>
#include "ProxyHandler.h"



class ServerMangaer {
public:
	ServerMangaer(Server& server, ProxyHandler& proxyHandler,int portNumber, size_t workers = 4);
	~ServerMangaer();
	void accept();
	

private:
	bool _isServerRunnung = false;
	Server* _server = nullptr;
	ProxyHandler* _proxyHandler = nullptr;
	std::vector<std::thread> _threads;
	std::queue<std::function<void()>> _taskQueue;
	std::mutex _queue_mutex;
	std::condition_variable _cv;
	size_t _workers;
	int _portNumber = 0;
	bool _stop;
	void initServer();	
	void addTask(std::function<void()> task);

};