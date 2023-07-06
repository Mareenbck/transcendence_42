import { Socket } from "socket.io";

type SocketMap = Map<string, Socket>;

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

    emitToId(userId: number, event: string, data: any | undefined = undefined) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.emit(event, data));
    }

    onFromId(userId: number, event: string, listener: any | undefined = undefined) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.on(event, listener));
    }

    offFromId(userId: number, event: string, listener: any | undefined = undefined) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.off(event, listener));
    }

    joinToRoomId(userId: number, room: string) {
        this.getUserSocketsId(userId)?.forEach((socket: Socket) => socket.join(room));
    }

    leaveRoom(room: string) {
        this.map?.forEach(socketMap => socketMap.forEach(socket => socket.leave(room)));
    }

    getUserSocketsId(userId: number): SocketMap | undefined {
        return this.map.get(userId);
    }

    getUserIdBySocket(socketId: string): number | undefined {
        for (const [key, socketMap] of this.map.entries()) {
            if (socketMap.has(socketId)) {
              return key;
            }
          }
          return undefined;
    }
}
