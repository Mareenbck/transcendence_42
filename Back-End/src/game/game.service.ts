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
	roomsList,
	invited
	} from './game.interfaces';
import { Games } from './game.class';


@Injectable()
export class GameService {
	constructor(private readonly prisma: PrismaService, 
		private readonly userService: UserService){}
	
// Les infos sur les sockets et l'accès au serveur Global
	public server: Server = null;
	public userSockets: UsersSockets;
	public gameService: GameService;

	// private playerR: any;
	// private playerL: any;
	private gameId: number = 0;

//connected users> random game >:  MAX length = 2 and after paring, cleared
	private players: any[] = []; 
//all connected spectateurs
	private spectateurs: any [] = []; // roomUsers = new Array();
//all connected spectateurs
	private invited: invited [] = []; // roomUsers = new Array();	
//map of the games
	private gameMap = new  Map<number, Game>();
//array of the active rooms 
	private roomArray: roomsList[]= [];	

	// getPlayer:any = (username: string) => {
    //     return this.players.find(u => +u.user.username === +username);
    // }
	getPair = (author: any, player: any): boolean => {
	console.log("47_game service getPair ", author, player)
		const index = this.invited.findIndex(pair => pair.author.username == author.username && pair.player.username == player.username);
	console.log("48_game service getPair ", index)
  		if (index !== -1) {
    		this.invited.splice(index, 1);
			return true;
		}
		return false;
	}
	// for (let i = 0; i < this.invitedPlayers.length; i++) {
	// 	if (this.invitedPlayers[i].author === author && this.invitedPlayers[i].player === player) {
	// 	  this.invitedPlayers.splice(i, 1);
	// 	  return true;

	
// add player in array "players"> random game > after pressing "Play Game"
	addPlayer = (user: any) => {
	    !this.players.some((u) => +u.user.userId === +user.userId) &&
		this.players.push({user})
	};

// creating rooms for a pair of players and game launch 
	addNewRoom = (playerR: any, playerL: any): void => {
		let roomN = 0;
		while (this.gameMap.has(roomN)){
			roomN++;
	    }
		const room = `room${roomN}`;
		this.userSockets.joinToRoom(playerR.user.username, room);
		this.userSockets.joinToRoom(playerL.user.username, room);

		let game = new Games (this.server, roomN, this.prisma, this.gameService, this.userSockets);
		game.init(playerR);
		game.init(playerL);
		this.gameMap[roomN] = game;
		game.initMoveEvent(playerR, playerL);
		this.roomArray.push({roomN, playerR, playerL});
// console.log("68 resultatArray ")
	 	this.server.emit("gameRooms", this.roomArray); // send to Front
		this.players = [];
		game.run();
	}

//function to process the message "playGame" or "watch"
	playGame = (player: any, roomN: number): void => {
		// if (!username){
		// 	return ;
		// }
		if (roomN == -1){ //
			this.addPlayer(player);
			if (this.players.length == 2){
//console.log("76_game.service: players  ", this.players);	
				this.addNewRoom(this.players[0], this.players[1]);
			}
		}
		else {
			this.gameMap[roomN].init(player);
			this.userSockets.joinToRoom(player.user.username, `room${roomN}`);
		}
	}

//function to process the messages "InviteGame", 'acceptGame', 'refuseGame'
	gameInvite = (author: any, player: any): void => {
console.log("112_game.service: invited message  ", author, player);	
			this.invited.push({author, player});
console.log("114_game.service: invited  ", this.invited);	
	}

///////////////////////////
// refuseGame: any = (author: UserDto, player: UserDto,) => {
// 	console.log(player.username);
// 	console.log("///////// refuses challenge from");
// 	console.log(author.username);	
// };

// acceptGame:any = (author: UserDto, player: UserDto,) => {
// 	console.log(player.username);
// 	console.log("///////// accepts challenge from");
// 	console.log(author.username);
// };
	acceptGame = (author: any, player: any): void => {
console.log("///////// GAME ACCEPT");
		if(this.getPair(author, player)){
			this.addNewRoom(author, player);
console.log("129_game.service: accept  ", this.invited);	
			}
	};
		
	refuseGame = (author: any, player: any): void => {
console.log("///////// GAME REFUSAL");
			this.getPair(author, player);
console.log("136_game.service: Refuse  ", this.invited);	
	};


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



}
