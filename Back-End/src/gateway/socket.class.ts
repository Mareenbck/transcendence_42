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
    console.log("26 Connect + map: client", this.map[0]);
       
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

    onFromUser(username: string, event: string, listener: any | undefined = undefined) {
        this.getUserSockets(username)?.forEach((socket: Socket) => socket.on(event, listener));
    }

    offFromUser(username: string, event: string, listener: any | undefined = undefined) {
        this.getUserSockets(username)?.forEach((socket: Socket) => socket.off(event, listener));
    }

    joinToRoom(username: string, room: string) {
        this.getUserSockets(username)?.forEach((socket: Socket) => socket.join(room));
    }

    leaveRoom(room: string) {
        this.map?.forEach(socketMap => socketMap.forEach(socket => socket.leave(room)));
    }

    getUserSockets(username: string): SocketMap | undefined {
        return this.map.get(username);
    }

    getUserBySocket(socketId: string): string | undefined {
        for (const [key, socketMap] of this.map.entries()) {
            if (socketMap.has(socketId)) {
              return key;
            }
          }
          return undefined;  
    }
}