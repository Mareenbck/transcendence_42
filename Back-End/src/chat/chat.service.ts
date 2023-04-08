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


    