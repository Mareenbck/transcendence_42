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

	searchPair = (author: number, player: number): boolean => {
		const index = this.invited.findIndex(i => i.author.id == author && i.player.id == player);
	console.log("53_game service searchPair ", index)
  		if (index !== -1) {
			this.invited.splice(index, 1);
			return true;
		}
		return false;
	}
	
// add player in array "players"> random game > after pressing "Play Game"
	addPlayer = (user: any) => {
	    !this.players.some((u) => +u.user.userId === +user.userId) &&
		this.players.push({user})
	};

// creating rooms for a pair of players and game launch 
	addNewRoom = (playerR: UserDto, playerL: UserDto): void => {
		let roomN = 0;
		while (this.gameMap.has(roomN)){
			roomN++;
	    }
		const room = `room${roomN}`;
		this.userSockets.joinToRoom(playerR.username, room);
		this.userSockets.joinToRoom(playerL.username, room);

		let game = new Games (this.server, roomN, this.prisma, this, this.userSockets);
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
	playGame = async (player: any, roomN: number): Promise<void> => {
		if (roomN == -1){ //
			this.addPlayer(player);
			if (this.players.length == 2){
				const playerR: UserDto = await this.userService.getUser(this.players[0].user.userId);
				const playerL: UserDto = await this.userService.getUser(this.players[1].user.userId)
// console.log("76_game.service: players  ", playerL);	
				this.addNewRoom(playerR, playerL);
			}
		}
		else {
			this.gameMap[roomN].init(player);
			this.userSockets.joinToRoom(player.user.username, `room${roomN}`);
		}
	}

//function to process the messages "InviteGame", 'acceptGame', 'refuseGame'
	gameInvite = (author: UserDto, player: UserDto): void => {
		this.invited.push({author, player});
	}

	acceptGame = (author: UserDto, player: UserDto): void => {
		if(this.searchPair(author.id, player.id)){
			this.addNewRoom(author, player);
		}
	};
		
	refuseGame = (author: UserDto, player: UserDto): void => {
console.log("///////// GAME REFUSAL");
		this.searchPair(author.id, player.id);
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
