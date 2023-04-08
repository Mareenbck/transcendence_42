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
<<<<<<< HEAD
  
=======
>>>>>>> 6e86ae6 (single socket for all FE WITH TOKEN)
  notifyIfConnected(usernames: string[], eventName: string, eventData: any) {
      usernames.forEach((username) => {
          this.userSockets.emitToUser(username, eventName, eventData);
      });
<<<<<<< HEAD
  }
=======
  }

  /*  constructor(
    private readonly authenticationService: AuthService,) {}
 
  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authenticationService.verifyAccessToken(authenticationToken);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
*/
>>>>>>> 6e86ae6 (single socket for all FE WITH TOKEN)
}