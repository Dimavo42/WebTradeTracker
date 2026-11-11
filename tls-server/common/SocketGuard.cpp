#include "SocketGuard.h"
#include <unistd.h>

SocketGuard::SocketGuard(int socket):_socket(socket)
{}

SocketGuard::~SocketGuard()
{
	if (_socket >= 0) {
        close(_socket);
    }
}

int SocketGuard::getSocket() const
{
	return _socket;
}


