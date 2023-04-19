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
	player,
	roomsList
	} from './game.interfaces';
import { join } from '@prisma/client/runtime';
import { Games } from './game.class';


@Injectable()
export class GameService {
	// Les infos sur les sockets et l'accès au serveur Global
	public server: Server = null;
	public userSockets: UsersSockets;

	private playerR: any;
	private playerL: any;
	private gameId: number = 0;

//all connected users
	players: any[] = []; //userChat = new Array();
//all connected spectateurs
	spectateurs: any [] = []; // roomUsers = new Array();
//roomsGames
	private gameMap = new  Map<number, Game>();
	private resultArray: roomsList[]= [];
	
  	constructor(private readonly prisma: PrismaService, 
			    private readonly userService: UserService){}

	getPlayer:any = (username: string) => {
        return this.players.find(u => +u.user.username === +username);
    }

	addPlayer = (user: any) => {
	    !this.players.some((u) => +u.user.userId === +user.userId) &&
		this.players.push({user})
	};

	addNewRoom = (playerR: any, playerL: any): void => {
		let roomN = 0;
		while (this.gameMap.has(roomN)){
			roomN++;
	    }
		const room = `room ${roomN}`;
	//    this.server.createRoom(room); 
		this.userSockets.joinToRoom(playerR.user.username, room);
		this.userSockets.joinToRoom(playerL.user.username, room);
		let game = new Games (this.server, roomN, this.prisma, 	this.userSockets);
		game.init(playerR);
		game.init(playerL);
		this.gameMap[roomN] = game;
		game.initMoveEvent(playerR, playerL);
		const resultArray: roomsList[]= [];
		resultArray.push({roomN, playerR, playerL});
	 	this.server.emit("gameRooms", resultArray);
		this.players = [];
		game.run();

	}

	playGame: any = (user: any) => {
		// if (!username){
		// 	return ;
		// }
		this.addPlayer(user);
		if (this.players.length == 2){
	console.log("76_game.service: plauers", this.players);

			this.addNewRoom(this.players[0], this.players[1]);
		}

	}

	addGames = (gameId, playersR, playersL) => {
	  //  !this.games.some((user) => +user.userId.userId === +userId.userId) &&
		//this.games.push({gameId, playersR, playersL})
	}

//message processing functions
// 	gameInvite: any = (author: number, socketAuth: Socket, player: number,) => {
// console.log("game.service: message gameInvite");
// 		this.addPlayer(author, socketAuth.id);
// 		// this.addGame(this.gameId, this.playerR, this.playerL);
// 		// let auth = this.getPlayer(author);
// 		// let plr = this.getPlayer(player);
// 		// if (auth && plr) {
			
// 		// 	};
// 	};

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

