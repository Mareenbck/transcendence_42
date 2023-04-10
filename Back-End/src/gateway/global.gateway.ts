import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage, OnGatewayInit,
  WebSocketGateway, OnGatewayDisconnect,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalService } from './global.service';
import { ChatService } from '../chat/chat.service';
import { GameService } from '../game/game.service';
import { Logger } from "@nestjs/common";
import UsersSockets from "./socket.class";
import { AuthService } from 'src/auth/auth.service';
import { UserService } from "src/user/user.service";
import { UserDto } from 'src/user/dto/user.dto';
import { CreateChatMessDto } from 'src/chat/chat-mess/dto/create-chatMess.dto';

@WebSocketGateway(
8001, { cors: {origin: "http://localhost:8080",}, }
/*{
  cors: ["*"],
  origin: ["*"],
  path: "",
}*/
)

export class GlobalGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GlobalGateway.name);
  private userSockets: UsersSockets;
  constructor(
      private readonly gameService: GameService,
      private readonly chatService: ChatService,
      private readonly globalService: GlobalService,
      private readonly authService: AuthService,
  ) {
      this.userSockets = new UsersSockets();
  }

  @WebSocketServer()
  server: Server;

  afterInit() {
      this.globalService.server = this.server;
      this.gameService.server = this.server;
      this.chatService.server = this.server;
      this.globalService.userSockets = this.userSockets;
      this.chatService.userSockets = this.userSockets;
      this.gameService.userSockets = this.userSockets;
      this.logger.verbose("globalGateway Initialized");
  }

  async handleConnection(client: Socket) {
    try {
console.log("Enter Global Soket server");
console.log(client.handshake.auth.token);
      const user = await this.authService.verifyAccessToken(client.handshake.auth.token);
//console.log(user);
if (!user) {
  throw new WsException('Invalid credentials.');
}
        client.data.username = user.username as string;
        client.data.email = user.email as string;
        this.userSockets.addUser(client);
        setTimeout(() => {
            this.server.emit("users-status", this.userSockets.usersStatus);
        }, 1000);
console.log("Global : Add to authenticated user");
        return this.userSockets.usersStatus;
    
    } catch (e) {
        if (this.userSockets.removeSocket(client)) {
            this.server.emit("users-status", this.userSockets.usersStatus);
        }
        client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    if (this.userSockets.removeSocket(client)) {
        this.server.emit("users-status", this.userSockets.usersStatus);
    }
    client.disconnect(true);
  }

  @SubscribeMessage('addUserChat')
  async chatAddUsers(
    @MessageBody() userId: any, @ConnectedSocket() socket: Socket,) 
  { 
    this.chatService.addUserChat(userId, socket.id)
    console.log("GLOBAL GATEWAY : Register CHAT");
  }

  @SubscribeMessage('removeUserChat')
  async chatRemoveUsers(@MessageBody() userId: number, @ConnectedSocket() socket: Socket,) 
  {
    this.chatService.removeUserChat(userId)
    console.log("GLOBAL GATEWAY : Remove CHAT");
  }

  @SubscribeMessage('userRoom')
  async chatUserRoom(@MessageBody() roomId: number, userId: number, @ConnectedSocket() socket: Socket,) 
  {
    this.chatService.addRoomUser(roomId, userId, socket.id);
    console.log("GLOBAL GATEWAY : Add to CHATROOM");
  }

  @SubscribeMessage('sendMChat')
  async chatSendChatM(@MessageBody()  authorId: number, chatroomId: number, content: string, @ConnectedSocket() socket: Socket,) 
  {
    this.chatService.sendChatMessage(authorId, chatroomId, content,)
    console.log("GLOBAL GATEWAY : Send Message ChatRoom");
  }

  @SubscribeMessage('sendMD')
  async chatSendDirectM(@MessageBody() content: string, author: string, receiver: string, @ConnectedSocket() socket: Socket,): Promise<void> 
  {
    console.log("qsqdqsdqsdqsd");
    this.chatService.sendDirectMessage(content, author, receiver,)
    console.log("GLOBAL GATEWAY : Send Message Direct");
  }


}
