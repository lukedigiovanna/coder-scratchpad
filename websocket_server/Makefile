CFLAGS=-g -O2 -pthread -Wall -Werror -Wmissing-prototypes

# include lib directory into runtime path to facilitate dynamic linking
LDFLAGS=-pthread

HEADERS=socket.h
OBJ=main.o socket.o

all:    server $(OTHERS)

$(OBJ) : $(HEADERS)

server: $(OBJ)
	$(CC) $(LDFLAGS) -o $@ $(OBJ) $(LDLIBS) 

clean:
	/bin/rm -f $(OBJ) $(OTHERS) server
