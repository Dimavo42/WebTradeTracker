#pragma once


class SocketGuard {
public:
	SocketGuard(int socket);
	~SocketGuard();
	SocketGuard(const SocketGuard&) = delete;
	SocketGuard& operator=(const SocketGuard&) = delete;
	int getSocket() const;

private:
	int _socket;
};