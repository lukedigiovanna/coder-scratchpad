import { Socket } from "socket.io-client";
import io from "socket.io-client"

import { Latch } from "./constants/latch";
import { ProgrammingLanguage } from "./constants/models";

const URL = "http://127.0.0.1:8080"

type HandlePacketCallback = (message: string) => void;
type HandleExitCallback = (status: number) => void;

interface ClientProps {
    onPacket: HandlePacketCallback;
    onExit: HandleExitCallback;
}

class Client {
    private _running: boolean = false;
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
        this.socket.on('exit', (status: number) => {
            props.onExit(status);
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
        if (this._running) {
            throw Error("Cannot start code execution while one is already in progress");
        }
        
        this._running = true;
        this.socket.emit("execute", {
            code,
            language,
        });
    }

    get running() {
        return this._running;
    }
}

export { Client };
export type { HandlePacketCallback, HandleExitCallback };
