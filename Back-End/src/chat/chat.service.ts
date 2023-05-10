import { Injectable, Logger, Inject  } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
import { UserDto } from "src/user/dto/user.dto";
import { UserChannelVisibility } from '@prisma/client';
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatService {

    public server: Server = null;
    private readonly logger = new Logger(ChatService.name);
    public userSockets: UsersSockets;

   // constructor(private readonly prismaService: PrismaService){}
    constructor(@Inject(UserService) private readonly userService: UserService) {}

    userChat = new Array();
    roomUsers = new Array();

    addUserChat:any = (userId : any, socketId: string) => {
        !this.userChat.some((u) => +u.userId.userId === +userId.userId) &&
        this.userChat.push({userId, socketId})
        this.server.sockets.emit('getUsersChat', this.userChat);
    }

    removeUserChat:any = (userId: any) => {
        this.userChat = this.userChat.filter(user => +user.userId.userId !== +userId.userId);
        this.roomUsers = this.roomUsers.filter( room => +room.userId.userId !== +userId.userId);
        this.server.sockets.emit('getUsersChat', this.userChat);
    };

    addRoomUser:any = (roomId: number, userId: number, socketId: number) => {
        this.roomUsers = this.roomUsers.filter( room => +room.userId !== +userId);
        roomId && this.roomUsers.push({roomId, userId, socketId});
    };

    getUser:any = (userId: number) => {
        return this.userChat.find(u => +u.userId.userId === +userId);
    }

    // SENDING MESSAGES
    sendRoomMessage:any = (authorId: number, chatroomId: number, content: string) => {
        const roomU = this.roomUsers.filter( room => +room.roomId === +chatroomId);
        console.log("room message", chatroomId)
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

    sendDirectMessage:any = async (content: string, author: number, receiver: number, ) => {
        const user = this.getUser(receiver);
        const a = this.getUser(author);
        if (user && a)
        {
            this.server.to(user.socketId).emit("getMessageDirect", {
                content,
                author,
                receiver,
            });
            const usersDirectForReceiver = await this.userService.getUsersWithMessages(receiver);
            if (!usersDirectForReceiver || !(usersDirectForReceiver.find(u => +u.id === +author)))
            {
                this.server.to(user.socketId).emit("getNewDirectUser", author);
            };
        }
        if (a && user) {
            const usersDirectForAuthor = await this.userService.getUsersWithMessages(author);
            if (!usersDirectForAuthor || !(usersDirectForAuthor.find(u => +u.id === +author)))
            {
                const a = this.getUser(author);
                this.server.to(a.socketId).emit("getNewDirectUser", receiver)
            };
        }
    };

    sendConv:any = (channelId: number, name: string, isPublic: boolean, isPrivate: boolean, isProtected: boolean) => {
        let visibility: UserChannelVisibility;
        if (isPrivate) {
          visibility = UserChannelVisibility.PRIVATE;
        } else if (isPublic) {
          visibility = UserChannelVisibility.PUBLIC;
        } else if (isProtected) {
          visibility = UserChannelVisibility.PWD_PROTECTED;
        }
        for(const user of this.userChat) {
            this.server.to(user.socketId).emit('getConv', {
                channelId: channelId,
                name: name,
                visibility: visibility
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
        if (userFrom) {
            this.server.to(userFrom.socketId).emit('blockForMe', {
                id: blockTo,
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
        if (userFrom) {
            this.server.to(userFrom.socketId).emit('unblockForMe', {
                id: blockTo,
            });
        }
    };

    // chatInvite: any = (author: UserDto, player: UserDto,) => {
    //     this.userSockets.emitToUser(player.username, 'wasInvited', author);
    // };

    chatInvite: any = (author: UserDto, player: UserDto,) => {
        this.userSockets.emitToId(player.id, 'wasInvited', author);
    };

    chatJoinedChannel: any = (channelId: number , socketId: string) => {
    // console.log("kkkkkkkkk", channelId, "szzzzz", socketId )
    // const newList = await this.chatroomService.getParticipants(data.channelId);
	// this.server.emit('joinedChannelR', newList);
    this.server.to(socketId).emit('joinedChannelR2', channelId);
	}
}
