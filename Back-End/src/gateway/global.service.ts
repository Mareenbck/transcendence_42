import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GlobalService {
  private _sockets = [];
  private _socketsOnClose = new Map();
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async registerSocket(socket) {
    socket.on('close', () => {
      this._sockets = this._sockets.filter((s) => s !== socket);
    });
    try {
        // verify tocken and that unique user behind and that online;
      this._sockets.push(socket);
    } catch (e) {
      this.send(socket, 'error', { message: 'Invalid session' });
      socket.close();
      return;
    }
  }

  registerOnClose(socket, action: () => void) {
    this._socketsOnClose.set(socket, [
      ...(this._socketsOnClose.get(socket) || []),
      action,
    ]);
  }

  async unregisterSocket(socket) {
    this._sockets = this._sockets.filter((s) => s !== socket);
    const actions = this._socketsOnClose.get(socket);
    if (actions) {
      actions.forEach((action) => action());
    }
    if (!socket.user) return;
    await this.prismaService.user.update({
      where: { id: socket.user.id },
      data: { status: 'OFFLINE' },
    });
    this.broadcast('user-status', {
      id: socket.user.id,
      status: 'OFFLINE',
    });
  }

  send(client: any, event: string, data: any) {
    client.send(JSON.stringify({ event: event, data: data }));
  }

  getSocketsFromUsersId(usersId: number[]) {
    return this._sockets.filter((socket) => {
      return usersId.includes(socket.user.id);
    });
  }

  sendToAllUsers(usersId: number[], event: string, data: any) {
    const receivers = this.getSocketsFromUsersId(usersId);
    this.sendToAll(receivers, event, data);
  }

  sendToAll(sockets: any[], event: string, data: any) {
    sockets.forEach((socket) => {
      this.send(socket, event, data);
    });
  }

  broadcast(event: string, data: any) {
    this.sendToAll(this._sockets, event, data);
  }
}
