import {Injectable} from '@nestjs/common';
import { 
	MessageBody,
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway
  } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'


@Injectable()
export class GameService {

}