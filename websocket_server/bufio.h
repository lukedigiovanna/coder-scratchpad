// A buffer is used for writing and reading to a socket

// Opaque type
struct bufio;

// Initializes a bufio
struct bufio* bufio_create(int fd);

// Frees the memory associated with this bufio and the bufio itself.
void bufio_destroy(struct bufio* self);

// Reads the content of the buffer up until the next CRLF
char* bufio_readline(struct bufio* self);

// Reads the remaining content of the buffer until EOF
char* bufio_read(struct bufio* self);

// Appends the given `content` to the internal buffer
void bufio_append(struct bufio* self, char* content);

// Writes the contents of the buffer to the given file descriptor, `fd`
void bufio_write(struct bufio* self, int fd);
