import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'http';
import { GlobalService } from './global.service';

@WebSocketGateway()
export class GlobalGateway implements OnGatewayConnection {
  constructor(private readonly globalService: GlobalService) {}

  @WebSocketServer() server: Server;

  async afterInit(server: Server) {
    server.on('connection', async (socket, request) => {
      socket['request'] = request;
      await this.globalService.registerSocket(socket);
    });
  }

  async handleConnection(socket) {}

  async handleDisconnect(socket) {
    this.globalService.unregisterSocket(socket);
  }
}
