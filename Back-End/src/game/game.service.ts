import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { GameDto } from './dto/game.dto';
import { TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
import {
	profile,
	player,
	ball,
	gameInit,
	GameParams
 } from './game.interfaces';
import { join } from '@prisma/client/runtime';


@Injectable()
export class GameService {
	// Les infos sur les sockets et l'accès au serveur Global
	public server: Server = null;
	public userSockets: UsersSockets;

	private playerR: player;
	private playerL: player;
	private gameId: number = 0;

  	constructor(private readonly prisma: PrismaService, 
			    private readonly userService: UserService){}




//all connected users
	players: profile[] = []; //userChat = new Array();
//all connected spectateurs
	spectateurs: profile [] = []; // roomUsers = new Array();
//roomsGames
	roomGameList: number [] = [];

	getPlayer:any = (userId: number) => {
        return this.players.find(u => +u.userId.userId === +userId);
    }

	addPlayer = (userId, socketId) => {
	    !this.players.some((user) => +user.userId.userId === +userId.userId) &&
		this.players.push({userId, socketId})
console.log("game.service: add players", this.players)
	};

	addNewRoom = (playerR: profile, playerL: profile): string => {
	   let n = 0;
	   while (this.roomGameList.includes(n)){
		n++;
	   }
	   const room = `room ${n}`;
	   this.server.createRoom(room);
	   const socketR = this.server.sockets.sockets.get(playerR.socketId);
	   socketR.join(room);
	   const socketL = this.server.sockets.sockets.get(playerL.socketId);
	   socketL.join(room);
	   return room;
	}

	playGame: any = (user: any, socket: Socket) => {
console.log("game.service: message playGame");
// 	let username = this.userSockets.getUserBySocket(socket.id);
// console.log("game.service: username connected", username);
		// if (!username){
		// 	return ;
		// }
		this.addPlayer(user.id, socket.id);
		if (this.players.length == 2){
			let roomName = this.addNewRoom(this.players[0], this.players[1]);
			let game = new Game (this.server, roomName, this.prisma, this );
			const playerR = this.server.sockets.sockets.get(this.players[0].socketId);
			game.init(playerR);
			const playerL = this.server.sockets.sockets.get(this.players[1].socketId);
			game.init(playerL);
			this.players = [];
			game.run();
		}

	}

	addGames = (gameId, playersR, playersL) => {
	  //  !this.games.some((user) => +user.userId.userId === +userId.userId) &&
		//this.games.push({gameId, playersR, playersL})
	}

//message processing functions
	gameInvite: any = (author: number, socketAuth: Socket, player: number,) => {
console.log("game.service: message gameInvite");
		this.addPlayer(author, socketAuth.id);
		// this.addGame(this.gameId, this.playerR, this.playerL);
		// let auth = this.getPlayer(author);
		// let plr = this.getPlayer(player);
		// if (auth && plr) {
			
		// 	};
	};

//adding and removing from players and observers to(from) array

/////////////////////////////////////
//DataBase
/////////////////////////////////////

	async create({playerOneId, playerTwoId, winnerId, score1, score2}) {//+async
		return this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});
	}

	async getGames() {
	return await this.prisma.game.findMany(
		{ include: {playerOne: true, playerTwo: true, winner: true}});
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


///////////////////////////
refuseGame: any = (author: UserDto, player: UserDto,) => {
	console.log("///////// GAME REFUSAL");
	console.log(player.username);
	console.log("///////// refuses challenge from");
	console.log(author.username);	
};

acceptGame:any = (author: UserDto, player: UserDto,) => {
	console.log("///////// GAME ACCEPT");
	console.log(player.username);
	console.log("///////// accepts challenge from");
	console.log(author.username);
};

}

