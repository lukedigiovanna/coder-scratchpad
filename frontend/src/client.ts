import { Socket } from "socket.io-client";
import io from "socket.io-client"

const URL = "http://127.0.0.1:5000"

class Client {
    constructor() {
        const conn = io(URL, {
            autoConnect: true
        });
        conn.on('message', (d) => {
            console.log(d);
        })
    }
}

export { Client };