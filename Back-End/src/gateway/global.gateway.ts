
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

<<<<<<< HEAD
  onModuleInit(){
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected GLOBAL');
=======
  @WebSocketServer() server: Server;


  async afterInit(server: Server) {
    server.on('connection', async (socket, request) => {
      socket['request'] = request;
      await this.globalService.registerSocket(socket);
>>>>>>> baa5c22 (size + game)
    });
  }


}
<<<<<<< HEAD
*/
=======


>>>>>>> baa5c22 (size + game)
