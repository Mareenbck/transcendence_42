import { PrismaService } from '../prisma/prisma.service';
<<<<<<< HEAD
//import { Game } from '@prisma/client';
import { Game } from './game.class';
import { BadRequestException, Injectable } from '@nestjs/common';
=======
import { Game } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
>>>>>>> 464f479 (achvmt rookie is ok)
import { UserService } from 'src/user/user.service';
import { GameDto } from './dto/game.dto';
import { TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { UserDto } from 'src/user/dto/user.dto';
<<<<<<< HEAD
=======




//////
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
//////



>>>>>>> a68fd93 (serveur BE 2/2)
//////
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
//////

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private userService: UserService){}

// Les infos sur les sockets et l'accès au serveur Global
  public server: Server = null;
  public userSockets: UsersSockets;

    players = new Array();
    spectators = new Array();
    roomGame = new Array();

    addUserGame:any = (userId : any, socketId: string) => {
        !this.players.some((u) => +u.userId.userId === +userId.userId) &&
        this.players.push({userId, socketId})
        this.server.sockets.emit('getUsersChat', this.players);
    }

    removeUserGame:any = (userId: any) => {
        this.players = this.players.filter(user => +user.userId.userId !== +userId.userId);
        this.roomGame = this.roomGame.filter( room => +room.userId.userId !== +userId.userId);
        this.server.sockets.emit('getUsersChat', this.players);
    };

    addRoomPlayer:any = (roomId: number, userId: number, socketId: number) => {
        this.roomGame = this.roomGame.filter( room => +room.userId !== +userId);
        roomId && this.roomGame.push({roomId, userId, socketId});
        console.log(this.roomGame);
    };

    removeRoomUser:any = (roomId: number, userId: number, socketId: number) => {
        this.roomGame = this.roomGame.filter( room => +room.userId !== +userId);
        roomId && this.roomGame.push({roomId, userId, socketId});
        console.log(this.roomGame);
    };

    addSpectators:any = (userId : any, socketId: string) => {
      !this.spectators.some((u) => +u.userId.userId === +userId.userId) &&
      this.spectators.push({userId, socketId})
      this.server.sockets.emit('getSpectators', this.spectators);
  }

    removeSpectators:any = (userId: any) => {
        this.spectators = this.spectators.filter(user => +user.userId.userId !== +userId.userId);
        this.server.sockets.emit('getUsersChat', this.players);
    };


    getUser:any = (userId: number) => {
        return this.players.find(u => +u.userId.userId === +userId);
    }

    const addUser = (userId, socketId) => {
        if (players.length < 2) {
          !players.some((user) => +user.userId.userId === +userId.userId) &&
          players.push({userId, socketId})
    console.log('40 players = ', players);
      } else {
        !users.some((user) => +user.userId.userId === +userId.userId) &&
        users.push({userId, socketId})
      }
    }


    this.server.on('connection', (socket: Socket) => {
      console.log('51 Connected socket = ', socket.id);
            if(socket) {
              game.init(socket);} //game initialization on connection
              socket.on("addUser", (userId) => {
              addUser(userId, socket.id); // add user : array users or array players
              // socket.on('play', (message: string) => {
              //   if (message == 'play'){
                 // addGame(socket.id);}
        console.log ('55 players = ', players.length);
        console.log ('56 users = ',users.length);
      
                const user = getUser(users);
                // const player = getPlayers(players);
                // this.server.emit("getSpectators", users);
                // this.server.emit("getPlayers", players);
                if (players.length == 2 ) {
                  //this.games.push(game);
                  game.run(
                    players[0], players[1], // start game with 2 players
                  );
                }
              });

	});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  create({playerOneId, playerTwoId, winnerId, score1, score2}) {
    return this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});

//////////////////////////////////////
//////////////////////////////////////
// Les infos sur les sockets et l'accès au serveur Global
// Plus besoin de gameGateway
  public server: Server = null;
  public userSockets: UsersSockets;
///////////////////////////////////////
////////////////////////////////////////


  create({playerOneId, playerTwoId, winnerId, score1, score2}) {
    return this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});
  }

  async getGames() {
    return await this.prisma.game.findMany(
      { include: {playerOne: true, playerTwo: true, winner: true}}
    );
  }

	async getUserGames(userId: number): Promise<Game[]> {
		const games = await this.prisma.game.findMany({
			where: {
				OR: [
					{ playerOneId: userId },
					{ playerTwoId: userId },
					{ winnerId: userId }
				]
			},
			include: {
				playerOne: true,
				playerTwo: true,
				winner: true
			}
		});
		return games;
	}

	async updateUserXPAndLevel(userId: number, allGames: GameDto[]) {
		const xpPerWin = 25;
		const numWins = allGames.filter(game => game.winnerId === userId).length;

		const newXP = numWins * xpPerWin;

		let newLevel = Math.floor(newXP / 100);

		const moduloXp = newXP % 100;

		const user = await this.prisma.user.update({
			where: { id: userId },
			data: {
				xp: moduloXp,
				level: newLevel,
			},
		});
		return user;
	}


}
