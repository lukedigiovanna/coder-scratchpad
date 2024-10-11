#ifndef BUFIO_H
#define BUFIO_H

#include "bufio.h"

#include <stdlib.h>
#include <stdio.h>

#define BLOCK_SIZE 2048

struct bufio {
    char* buffer; // Internal buffer
    int head;   // Position in reading/writing
    int fd; // File descriptor to read from
};

struct bufio* bufio_create(int fd) {
    struct bufio* self = (struct bufio*) malloc(sizeof(struct bufio));

    if (self == NULL) {
        perror("failed to allocate bufio");
        exit(EXIT_FAILURE);
    }

    self->buffer = malloc(BLOCK_SIZE);
    self->head = 0;
    self->fd = fd;

    return self;
}

void bufio_destroy(struct bufio* self) {
    free(self->buffer);
    free(self);
}

char* bufio_readline(struct bufio* self) {
    return NULL;
}

char* bufio_read(struct bufio* self) {
    return NULL;
}

void bufio_append(struct bufio* self, char* content) {

}

void bufio_write(struct bufio* self, int fd) {

}

#endif