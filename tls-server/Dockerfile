FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY main.cpp .
COPY common ./common

RUN g++ -std=c++17 -O2 main.cpp common/*.cpp -I. -o main -pthread -lssl -lcrypto

CMD ["./main"]
