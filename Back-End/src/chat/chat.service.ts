import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";

@Injectable()
export class ChatService {
    public server: Server = null;
    private readonly logger = new Logger(ChatService.name);
    public userSockets: UsersSockets;

    constructor(private readonly prismaService: PrismaService){}
    
    userChat = new Array();
    roomUsers = new Array();

    addUserChat:any = (userId : any, socketId: string) => {
        this.userChat = this.userChat.filter( user => user.userId.isLoggedIn === true);
        this.roomUsers = this.roomUsers.filter( room => room.userId.isLoggedIn === true);
        !this.userChat.some((u) => +u.userId.userId === +userId.userId) &&
        this.userChat.push({userId, socketId})
        this.server.sockets.emit('getUsersChat', this.userChat);
    }

    removeUserChat:any = (userId: any) => {
        this.userChat = this.userChat.filter(user => +user.userId.userId !== +userId.userId);
        this.roomUsers = this.roomUsers.filter( room => +room.userId.userId !== +userId.userId);
        this.userChat = this.userChat.filter( user => user.userId.isLoggedIn === true);
        this.roomUsers = this.roomUsers.filter( room => room.userId.isLoggedIn === true);
        this.server.sockets.emit('getUsersChat', this.userChat);
    };

    addRoomUser:any = (roomId: number, userId: number, socketId: number) => {
        this.roomUsers = this.roomUsers.filter( room => +room.userId !== +userId);
        roomId && this.roomUsers.push({roomId, userId, socketId});
        console.log(this.roomUsers);
    };

    removeRoomUser:any = (roomId: number, userId: number, socketId: number) => {
        this.roomUsers = this.roomUsers.filter( room => +room.userId !== +userId);
        roomId && this.roomUsers.push({roomId, userId, socketId});
        console.log(this.roomUsers);
    };


    getUser:any = (userId: number) => {
        return this.userChat.find(u => +u.userId.userId === +userId);
    }

    // SENDING MESSAGES
    sendRoomMessage:any = (authorId: number, chatroomId: number, content: string) => {
        const roomU = this.roomUsers.filter( room => +room.roomId === +chatroomId);
        if (roomU.length > 1) {
            for(const room of roomU) {
                this.server.to(room.socketId).emit("getMessageRoom", {
                    authorId,
                    chatroomId,
                    content,
                });
            }
        }
    };

    sendDirectMessage:any = (content: string, author: number, receiver: number, ) => {
        const user = this.getUser(receiver);
        if (user) {
            this.server.to(user.socketId).emit("getMessageDirect", {
                content,
                author,
                receiver,
            });
        }
    };

    sendConv:any = (author: number, content: string) => {
        for(const user of this.userChat) {
            this.server.to(user.socketId).emit('getConv', {
                content,
            });
        }
    };

    chatBlock:any = (blockFrom: number, blockTo: number,) => {
        const userTo = this.getUser(blockTo);
        const userFrom = this.getUser(blockFrom);
        if (userTo) {
            this.server.to(userTo.socketId).emit('wasBlocked', {
                id: blockFrom,
                user: userFrom,
            });
        }
    };

    chatUnblock:any = (blockFrom: number, blockTo: number,) => {
        const userTo = this.getUser(blockTo);
        const userFrom = this.getUser(blockFrom);
        if (userTo) {
            this.server.to(userTo.socketId).emit('wasUnblocked', {
                id: blockFrom,
                user: userFrom,
            });
        }
    };

    chatInvite: any = (author: number, player: number,) => {
        const toU = this.getUser(player);
        if (toU) {
            this.server.to(toU.socketId).emit('wasInvited', {
                from: author,
                to: player,
            });
        };
    };
}


    