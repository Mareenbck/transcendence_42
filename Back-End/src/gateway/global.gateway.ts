import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GlobalService } from './global.service';
 
@WebSocketGateway()
export class GlobalGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
 
  constructor(private readonly globalService: GlobalService) {}
 
  async handleConnection(socket: Socket) {
    await this.globalService.getUserFromSocket(socket);
  }

  // EXEMPLES DE MESSAGES Reception et Envoie 

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) 
  {
    const author = await this.globalService.getUserFromSocket(socket);
  //  const message = await this.globalService.saveMessage(content, author);
    const message = {content: "Hello World",};
 
    this.server.sockets.emit('receive_message', message);
    return message;
  }
 
  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @ConnectedSocket() socket: Socket,
  ) 
  {
    await this.globalService.getUserFromSocket(socket);
   // const messages = await this.globalService.getAllMessages();
    const messages = {
      content: "hello",};
    socket.emit('send_all_messages', messages);
  }
}

