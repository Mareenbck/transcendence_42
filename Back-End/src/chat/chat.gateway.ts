import {
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';

@WebSocketGateway(8001, { cors: 'http://localhost/chat/*' })
export class ChatGateway {
     @WebSocketServer() server;
     @SubscribeMessage('message')
     handleMessage(@MessageBody() message: string): void {
     console.log(message);
     this.server.emit('message', message);
   }
}
