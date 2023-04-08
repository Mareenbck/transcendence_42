import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage, OnGatewayInit,
  WebSocketGateway, OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalService } from './global.service';
import { ChatService } from '../chat/chat.service';
import { GameService } from '../game/game.service';
import { Logger } from "@nestjs/common";
import UsersSockets from "./socket.class";
import { AuthService } from 'src/auth/auth.service';
import { UserService } from "src/user/user.service";


@WebSocketGateway({
  cors: ["*"],
  origin: ["*"],
  path: "/api/ws/",
})

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
      this.gameService.userSockets = this.userSockets;
      this.logger.verbose("globalGateway Initialized");
  }

  async handleConnection(client: Socket) {
    try {
        const user: any = this.authService.verifyAccessToken(client.handshake.auth.token);
        client.data.username = user.username as string;
        client.data.email = user.email as string;
        this.userSockets.addUser(client);
        setTimeout(() => {
            this.server.emit("users-status", this.userSockets.usersStatus);
        }, 1000);
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

  /*
  @SubscribeMessage("game-invite")
  gameInvite(client: Socket, data: GameInvitePayload) {
      return this.gameService.gameInvite(client, data);
  }

  @SubscribeMessage("logout")
  logout(client: Socket) {
      this.userSockets.removeUser(client);
  }

  @SubscribeMessage("matchmaking")
  handleMatchMakingRequest(client: Socket, data: GameInvitePayload) {
      return this.gameService.handleMatchMakingRequest(client, data);
  }

  @SubscribeMessage("watch-game")
  addSpectator(client: Socket, gameId: string) {
      try {
          this.gameService.addSpectator(client, gameId);
          this.server.emit("users-status", this.userSockets.usersStatus);
      } catch (err) {
          return err;
      }
      return "OK";
  }
  @SubscribeMessage("unwatch-game")
  removeSpectator(client: Socket, gameId: string) {
      this.gameService.removeSpectator(client, gameId);
      this.server.emit("users-status", this.userSockets.usersStatus);
  }
*/


  // EXEMPLES DE MESSAGES Reception et Envoie 

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) 
  {
    console.log("ESSAIE au GLOBAL BE");
 //   const author = await this.globalService.getUserFromSocket(socket);
  //  const message = await this.globalService.saveMessage(content, author);
    console.log(this.server.sockets);
    console.log("SUCCESS GLOBAL BE");
    const message = {content: "Hello World",};
 
    this.server.sockets.emit('receive_message', message);
    return message;
  }
 
  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @ConnectedSocket() socket: Socket,
  ) 
  {
//    await this.globalService.getUserFromSocket(socket);
   // const messages = await this.globalService.getAllMessages();
    const messages = {
      content: "hello",};
    socket.emit('send_all_messages', messages);
  }
}

