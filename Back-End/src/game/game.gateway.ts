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
// console.log('player 21', userId);
    !players.some((user) => +user.userId.userId === +userId.userId) &&
    players.push({userId, socketId})
// console.log(`24 players [] ='${players}'`);
  } else {
    !users.some((user) => +user.userId.userId === +userId.userId) &&
    users.push({userId, socketId})
  }
}

const getUser = (userId) => {
  return users.find(user => +user.userId.userId === +userId)
}

const getPlayers = (userId) => {
  return players.find(user => +user.userId.userId === +userId)
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
console.log('51 Connected socket = ', socket.id);

      socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
console.log ('55 players = ',players.length);
console.log ('56 users = ',users.length);

        // const user = getUser(users);
        // const player = getPlayers(players);
        this.server.emit("getSpectators", users);
        this.server.emit("getPlayers", players);
this.server.clients[socket.id].on('move', ()=>{console.log('----move---')});
        if (players.length == 2) {
          const game = new Game( 
            players[0] , players[1],
            this.server,
            //this.websocketsService,
            this.prismaService,
            //this.achievementsService,
          );
          //this.games.push(game);
          game.init();
          game.run();
        }
      });

      socket.on('disconnect', () => {
console.log(`78 Disconnected socket.id = ${socket.id}`);
        removeUser(socket.id);
        this.server.emit("getSpectator", users);
      });
  });
}
}

// this.games.splice(this.games.indexOf(game), 1);
