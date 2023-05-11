import { Socket } from "socket.io";

// MapA de (socket.id, socket) 
type SocketMap = Map<string, Socket>;

// MapB du (userId, mapA)
type SocketMapMap = Map<number, SocketMap>;

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
        if (!this.map.has(socket.data.id)) {
            this.map.set(socket.data.id, new Map<string, Socket>().set(socket.id, socket));
        } else {
            this.map.get(socket.data.id).set(socket.id, socket);
        }      
    }

    removeSocket(socket: Socket) {
        if (this.map.has(socket.data.id)) {
            socket.disconnect(true);
            this.map.get(socket.data.id).delete(socket.id);
            if (this.map.get(socket.data.id).size === 0) {
                this.map.delete(socket.data.id);
                return true;
            }
        }
        return false;
    }
    
    // emitToUser(username: string, event: string, data: any | undefined = undefined) {
    //     this.getUserSockets(username)?.forEach((socket: Socket) => socket.emit(event, data));
    // }

    emitToId(userId: number, event: string, data: any | undefined = undefined) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.emit(event, data));
    }
////////////////

    // onFromUser(username: string, event: string, listener: any | undefined = undefined) {
    //     this.getUserSockets(username)?.forEach((socket: Socket) => socket.on(event, listener));
    // }

    onFromId(userId: number, event: string, listener: any | undefined = undefined) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.on(event, listener));
    }
//////////////

    // offFromUser(username: string, event: string, listener: any | undefined = undefined) {
    //     this.getUserSockets(username)?.forEach((socket: Socket) => socket.off(event, listener));
    // }

    offFromId(userId: number, event: string, listener: any | undefined = undefined) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.off(event, listener));
    }

/////////////
    // joinToRoom(username: string, room: string) {
    //     this.getUserSockets(username)?.forEach((socket: Socket) => socket.join(room));
    // }

    joinToRoomId(userId: number, room: string) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.join(room));
    }

//////////////    
    leaveRoom(room: string) {
        this.map?.forEach(socketMap => socketMap.forEach(socket => socket.leave(room)));
    }
/////////////
    // getUserSockets(username: string): SocketMap | undefined {
    //     return this.map.get(username);
    // }

    getUserSocketsId(userId: number): SocketMap | undefined {
        return this.map.get(userId);
    }
/////////////
    // getUserBySocket(socketId: string): string | undefined {
    //     for (const [key, socketMap] of this.map.entries()) {
    //         if (socketMap.has(socketId)) {
    //           return key;
    //         }
    //       }
    //       return undefined;  
    // }

    getUserIdBySocket(socketId: string): number | undefined {
        for (const [key, socketMap] of this.map.entries()) {
            if (socketMap.has(socketId)) {
              return key;
            }
          }
          return undefined;  
    }
}