#include <stdio.h>

#include "socket.h"
#include "bufio.h"

#include <sys/socket.h>
#include <unistd.h>
#include <fcntl.h>

#define PORT 8080
#define MAX_MESSAGE_SIZE 256

static void handle_client(int client_fd) {
    char buffer[MAX_MESSAGE_SIZE];
    read(client_fd, buffer, MAX_MESSAGE_SIZE);
    // Need to parse the buffer

    printf("From client: %s\n", buffer);
}

int main(int argc, char* argv[]) {
    int fd = open("main.c", O_CREAT, O_RDONLY);
    struct bufio* buff = bufio_create(fd);

    bufio_destroy(buff);

    return 0;

    // Set up a socket server
    int server_socket_fd = server_bind_and_listen(PORT);

    printf("Listening to clients on 127.0.0.1:%d\n", PORT);

    for (;;) {
        // Wait for a connection
        struct sockaddr client_address;
        socklen_t len;
        int client_fd = accept(server_socket_fd, &client_address, &len);

        handle_client(client_fd);
    }

    close(server_socket_fd);

    return 0;
}