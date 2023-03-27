import { 
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { GameService } from './game.service';
import { Game } from './game.class';
import { PrismaService } from 'src/prisma/prisma.service';


//all connected
let users = [];
//two players
let players = [];

const addUser = (userId, socketId) => {
  if (players.length < 2) {
    console.log(userId);
    !players.some((user) => +user.userId.userId === +userId.userId) &&
    players.push({userId, socketId})
  } else {
    !users.some((user) => +user.userId.userId === +userId.userId) &&
    users.push({userId, socketId})
  }
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
  players = players.filter(user => user.socketId !== socketId);
}

@WebSocketGateway(8001, { cors: 'http://localhost/game/*' })
export class GameGateway {
 
  @WebSocketServer() server: Server;
  prismaService: PrismaService;
  onModuleInit(){
    this.server.on('connection', (socket) => {
console.log(socket.id);
console.log('Connected');

      socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        this.server.emit("getUsers", users);
        if (players.length < 2) {
          const game = new Game(
            { socket: players[0].socketId, userId: players[0].userId },
            { socket: players[1].socketId, userId: players[1].userId },
            //this.websocketsService,
            this.prismaService,
            //this.achievementsService,
          );
          //this.games.push(game);
          game.run();
  }
}

// this.games.splice(this.games.indexOf(game), 1);
