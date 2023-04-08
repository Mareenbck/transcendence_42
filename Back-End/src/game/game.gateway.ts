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
import { profile } from './game.interfaces';


//all connected users
let users: profile [] = [];
//two players
let players: profile [] = [];


// // const addUser = (userId, socketId) => {
// //   if (players.length < 2) {
// // console.log('22 player ', userId);
// //     const index = players.findIndex((x) => +x.userId.userId === +userId.userId);
// // console.log('24 player index ', index);
// //     if (index === -1) {
// // console.log('26 players.push({userId: userId, socketId: [socketId]})');
// //       // If s1 does not exist, add it with a new list containing s2
// //       players.push({userId: userId, socketId: [socketId]});
// //     } else {
// // console.log('30 players[index]', players[index]);
// //       // If s1 exists, append s2 to the existing list of s1
// //       !players[index].socketId.some((socket) => +socket === +socketId) &&
// //       players[index].socketId.push(socketId)
// //     }
// // console.log(`24 players [] ='${players}'`);
    // const addUser = (userId, socketId) => {
    //     if (players.length < 2) {
    //       !players.some((user) => +user.userId.userId === +userId.userId) &&
    //       players.push({userId, socketId})
    // console.log('40 players = ', players);
    //   } else {
    //     !users.some((user) => +user.userId.userId === +userId.userId) &&
    //     users.push({userId, socketId})
    //   }
    // }
    const addGame = (socketId) => {
      // !players.some((user) => +user.userId.userId === +userId.userId) &&
        players.push({
          socketId,
          userId: undefined
        })
    }

// const getUser = (userId) => {
//   return users.find(user => +user.userId.userId === +userId)
// }

// const getPlayers = (userId) => {
//   return players.find(user => +user.userId.userId === +userId)
// }

    const removeUser = (socketId) => {
      users = users.filter(user => user.socketId !== socketId);
      players = players.filter(user => user.socketId !== socketId);
    }


@WebSocketGateway(8001, { cors: 'http://localhost/game/*' })//cors *
export class GameGateway {

  @WebSocketServer() server: Server;
   constructor(
        private prisma: PrismaService,
        private service: GameService ){}

  onModuleInit(){
    const game = new Game(
      this.server,
      //this.websocketsService,
      this.prisma,
      //this.achievementsService,
      this.service
    );


    this.server.on('connection', (socket: Socket) => {
console.log('51 Connected socket = ', socket.id);
      if(socket) {
        game.init(socket);} //game initialization on connection
        // socket.on("addUser", (userId) => {
        // addUser(userId, socket.id); // add user : array users or array players
        socket.on('play', (message: string) => {
          if (message == 'play'){
           // addGame(socket.id);
  console.log ("94 socket play", socket);
          }
  console.log ('55 players = ', players.length);
  console.log ('56 users = ',users.length);


@WebSocketGateway()
export class GameGateway {
	constructor(
		private readonly gameService: GameService) {}
		
	@SubscribeMessage('matchmaking')
	async matchmaking(socket: any, payload: any) {
		if (!payload || !payload.action) return;
		switch (payload.action) {
			case 'join':
				this.gameService.joinQueue(socket, payload.type);
				break;
			case 'cancel':
				this.gameService.cancelQueue(socket);
				break;
			case 'leave':
				this.gameService.leaveGame(socket);
				break;
		}
	}

  @SubscribeMessage('game-input')
	async gameInput(socket: any, payload: any) {
		if (!payload || !payload.action || !payload.direction) return;
		const game = this.gameService.getGameWherePlayerIs(socket.user.id);
		if (!game) return;
		game.processInput(socket.user.id, payload);
	}

	@SubscribeMessage('spectate-match')
	async spectateMatch(socket: any, payload: any) {
		if (!payload || !payload.id) return;
		const game = this.gameService.getGameWherePlayerIs(payload.id);
		if (!game) {
			this.websocketsService.send(socket, 'spectate-match', {
				status: 'error',
				error: 'Game not found',
			});
			return;
		}
		this.websocketsService.send(socket, 'spectate-match', {
			status: 'success',
		});
		game.addSpectator(socket);
	}

  @SubscribeMessage('spectate-match-name')
	async spectateMatchName(socket: any, payload: any) {
		if (!payload || !payload.name) return;
		const game = this.gameService.getGameWherePlayerIsByName(payload.name);
		if (!game) {
			this.websocketsService.send(socket, 'spectate-match', {
				status: 'error',
				error: 'Game not found',
			});
			return;
		}
		this.websocketsService.send(socket, 'spectate-match', {
			status: 'success',
		});
		game.addSpectator(socket);
	}

	@SubscribeMessage('spectate-leave')
	async spectateLeave(socket: any, payload: any) {
		const game = this.gameService.getGameWhereSpectatorIs(socket.user.id);
		if (!game) return;
		game.removeSpectator(socket);
	}
}





//     this.server.on('connection', (socket: Socket) => {
// console.log('51 Connected socket = ', socket.id);
//       if(socket) {
//         game.init(socket);} //game initialization on connection
//         socket.on("addUser", (userId) => {
//         addUser(userId, socket.id); // add user : array users or array players
//         // socket.on('play', (message: string) => {
//         //   if (message == 'play'){
//            // addGame(socket.id);}
//   console.log ('55 players = ', players.length);
//   console.log ('56 users = ',users.length);

//           const user = getUser(users);
//           // const player = getPlayers(players);
//           // this.server.emit("getSpectators", users);
//           // this.server.emit("getPlayers", players);
//           if (players.length == 2 ) {
//             //this.games.push(game);
//             game.run(
//               players[0], players[1], // start game with 2 players
//             );
//           }
//         });
//         this.server.sockets.sockets.get(socket.id).on('disconnect', () => {//??
//   console.log(`78 Disconnected socket.id = ${socket.id}`);
//           removeUser(socket.id);
//           this.server.emit("getSpectator", users);
//         });
//       //}
//     });
//   }
}

// this.games.splice(this.games.indexOf(game), 1);
    }
