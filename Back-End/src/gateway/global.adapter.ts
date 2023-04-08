import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server } from "socket.io";

// SEE ???
class GlobalEngine extends Server {
    constructor() {
        super();
    }
}

// SEE ???
export class GlobalSocketAdapter extends IoAdapter {
    constructor(app: INestApplicationContext) {
        super(app);
    }

    createIOServer(port: number, options?: any): Server {
        options ? (options.server = new GlobalEngine()) : { ...options, server: new GlobalEngine() };
        const server: Server = super.createIOServer(port, options);
        return server;
    }
}