import { Latch } from "./latch";
import { ProgrammingLanguage } from "./models";

const URL = "http://127.0.0.1:8080/ws";

type HandlePacketCallback = (message: string) => void;
type HandleExitCallback = (status: number) => void;

interface ClientProps {
    onPacket: HandlePacketCallback;
    onExit: HandleExitCallback;
}

// Create an instance of this when running a 
class CodeRunnerClient {
    private latch: Latch;
    private socket: WebSocket;
    
    constructor(props: ClientProps) {
        this.latch = new Latch();
        this.socket = new WebSocket(URL);
        this.socket.onopen = () => {
            console.log("Opened connection");
            this.latch.release();
        }

        this.socket.onmessage = (ev: MessageEvent) => {
            const { data } = ev;
            const { event, args } = JSON.parse(data);
            if (event === "output") {
                props.onPacket(args);
            }
            else if (event === "exit") {
                props.onExit(args.status);
            }
            console.log("Received message", ev);
        }
    }

    async awaitConnection() {
        await this.latch.wait();
    }

    execute(code: string, language: ProgrammingLanguage) {
        // Send string encoding of the code and language in a JSON object
        const message = {
            event: "execute",
            args: {
                code,
                language
            }
        };
        const messageString = JSON.stringify(message);
        console.log("sending", messageString);
        this.socket.send(messageString);
    }
};

export { CodeRunnerClient };

