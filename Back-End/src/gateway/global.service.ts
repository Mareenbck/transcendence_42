import { Global, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server } from "socket.io";
import UsersSockets from "./socket.class";

@Global()
@Injectable()
export class GlobalService {
  public server: Server = null;
  public userSockets: UsersSockets;
  constructor() {}
  
  // notifyIfConnected(usernames: string[], eventName: string, eventData: any) {
  //     usernames.forEach((username) => {
  //         this.userSockets.emitToUser(username, eventName, eventData);
  //     });
  // }

  notifyIfConnectedId(userIds: number[], eventName: string, eventData: any) {
    userIds.forEach((userId) => {
        this.userSockets.emitToId(userId, eventName, eventData);
    });
}
}