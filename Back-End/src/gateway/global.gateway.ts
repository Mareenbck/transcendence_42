
/*
import {
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway(8001, { cors: 'http://localhost:8080' })

export class GlobalGateway {
  @WebSocketServer()
  server;

  onModuleInit(){
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected GLOBAL');
    });
  }


}
*/
