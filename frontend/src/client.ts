import { Socket } from "socket.io-client";
import io from "socket.io-client"

import { Latch } from "./latch";

const URL = "http://127.0.0.1:5000"

type HandlePacketCallback = (message: string) => void;
type HandleExitCallback = () => void;

interface ClientProps {
    onPacket: HandlePacketCallback;
    onExit: HandleExitCallback;
}

// Supported programming languages:
type ProgrammingLanguage = 'python';

class Client {
    private running: boolean = false;
    private connected: boolean = false;
    private connectionLatch: Latch;
    private socket: Socket;

    constructor(props: ClientProps) {
        this.connectionLatch = new Latch();
        this.socket = io(URL, {
            autoConnect: false
        });
        this.socket.on('connect', () => {
            console.log('connected');
            this.connected = true;
            this.connectionLatch.release();
        });
        this.socket.on('output', (d: string) => {
            props.onPacket(d);
        });
        this.socket.on('error', (err: any) => {
            console.log(err);
        });
        this.socket.on('exit', () => {
            props.onExit();
            this.socket.disconnect();
        });
        this.socket.connect();
    }

    async awaitConnection() {
        await this.connectionLatch.wait();
    }

    execute(code: string, language: ProgrammingLanguage) {
        if (!this.connected) {
            throw Error("Client not yet connected");
        }
        if (this.running) {
            throw Error("Cannot start code execution while one is already in progress");
        }
        
        this.running = true;
        this.socket.emit("execute", {
            code,
            language,
        });
    }
}

export { Client };
export type { HandlePacketCallback, HandleExitCallback };
