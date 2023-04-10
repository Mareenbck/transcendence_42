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

    addUserChat:any = (userId : any, socketId: number) => {
        !this.userChat.some((u) => +u.userId.userId === +userId.userId) &&
        this.userChat.push({userId, socketId})
        console.log("szasazsazsasasasazsasas");
        //console.log(this.userChat);
        this.server.sockets.emit('getUsersChat', this.userChat);
    }

    removeUserChat:any = (userId: number) => {
        this.userChat = this.userChat.filter(user => +user.userId.userId !== +userId);
        this.roomUsers = this.roomUsers.filter( room => +room.userId.userId !== +userId);
        this.server.sockets.emit('getUsersChat', this.userChat);
    };

    addRoomUser:any = (roomId: number, userId: number, socketId: number) => {
        this.roomUsers = this.roomUsers.filter( room => +room.userId !== +userId);
        roomId && this.roomUsers.push({roomId, userId, socketId});
        console.log(this.roomUsers);
    };

    sendChatMessage:any = (authorId: number, chatroomId: number, content: string) => {
        const roomU = this.roomUsers.filter( room => +room.roomId === +chatroomId);
        if (roomU.length > 1) {
            for(const room of roomU) {
                this.server.to(room.socketId).emit("getMChat", {
                    authorId,
                    chatroomId,
                    content,
                });
            }
        }
    };

    getSocket:any = (userId: number) => {
        return this.userChat.find(u => +u.userId === +userId)
    }

    sendDirectMessage:any = (content: string, author: string, receiver: string, ) => {
        console.log("in ChatService to send direct");
        const socketId = this.getSocket(+receiver);
        if (socketId) {
            this.server.to(socketId).emit("getMChat", {
                content,
                author,
                receiver,
            });
        }
    };

/*
        sendPrivateMessageNotification(user: UserWhole, infos_user: SubInfosWithChannelAndUsers, message: Message): void {
            const friendUsername: string =
                infos_user.channel.subscribedUsers[0].username === user.username ? infos_user.channel.subscribedUsers[1].username : infos_user.channel.subscribedUsers[0].username;
            this.userSockets.getUserSockets(friendUsername)?.forEach((sock) => {
                if (sock?.data.current_channel !== infos_user.channelId) {
                    sock?.emit("notifmessage", {
                        username: user.username,
                        message: message.content,
                    });
                }
            });
        }

        
*/


    
}


    