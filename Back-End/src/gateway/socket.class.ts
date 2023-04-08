import { Socket } from "socket.io";

// MapA de (socket.id, socket) 
type SocketMap = Map<string, Socket>;

// MapB du (userName, mapA)
type SocketMapMap = Map<string, SocketMap>;

export default class UsersSockets {
    private map: SocketMapMap;
    constructor() {
        this.map = new Map();
    }
    get users() {
        return this.map;
    }

    addUser(socket: Socket) {
        socket.data.status = "ONLINE";
        if (!this.map.has(socket.data.username)) {
            this.map.set(socket.data.username, new Map<string, Socket>().set(socket.id, socket));
        } else {
            this.map.get(socket.data.username).set(socket.id, socket);
        }
    }

    removeSocket(socket: Socket) {
        if (this.map.has(socket.data.username)) {
            socket.disconnect(true);
            this.map.get(socket.data.username).delete(socket.id);
            if (this.map.get(socket.data.username).size === 0) {
                this.map.delete(socket.data.username);
                return true;
            }
        }
        return false;
    }
    
    emitToUser(username: string, event: string, data: any | undefined = undefined) {
        this.getUserSockets(username)?.forEach((socket: Socket) => socket.emit(event, data));
    }

    getUserSockets(username: string): SocketMap | undefined {
        return this.map.get(username);
    }
}
