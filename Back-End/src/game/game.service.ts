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
import { GameRoom } from './game.class';


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
	private gameMap = new  Map<number, GameRoom>();
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
	    !this.players.some((u) => +u.userId === +user.userId) &&
		this.players.push(user);
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

		let game = new GameRoom (this.server, roomN, this.prisma, this, this.userSockets);
		game.init(playerR);
		game.init(playerL);
		this.gameMap[roomN] = game;
		game.setPlayers(playerR, playerL);
		game.initMoveEvents();
		this.roomArray.push({roomN, playerR, playerL});
 console.log("68 resultatArray ", playerL)
		this.players = [];
		this.sendListRooms();
		game.run();
	}

// removing room 
	removeRoom = (roomN: number): void => {
		const room = `room${roomN}`;
		this.userSockets.leaveRoom(room);
		let game = this.gameMap[roomN];
		game = [];
		this.gameMap.delete(roomN);
		this.roomArray = this.roomArray.filter(i => i.roomN != roomN);
		this.sendListRooms();
	}
// emit to all users all rooms that play
	sendListRooms = () => {
		this.server.emit("gameRooms", this.roomArray); // send to Front
	}

	checkPlayerInRooms = async (player: any) => {
console.log("101_game.service: checkPlayerInRoom user = ", player);	
		const playerDto: UserDto = await this.userService.getUser(player.userId);
		// find room by user Dto
		const [roomN, ] = Array.from(this.gameMap.entries()).find(([, game]) => game.checkPlayer(playerDto) ) || [undefined, undefined];
console.log("101_game.service: checkPlayer roomN = ", roomN);	
		if (roomN) {
			// if exist send init
			this.playGame(playerDto, roomN);
		}
		else{
			// or new game
			this.playGame(playerDto, -1);
		}
	}

//function to process the message "playGame" or "watch"
	playGame = async (player: any, roomN: number): Promise<void> => {
console.log("///////// GAME PLAY", player);
		// const playerDto: UserDto = await this.userService.getUser(player.userId);
		// // find room by user Dto
		// const [N, ] = Array.from(this.gameMap.entries()).find(([, game]) => game.checkPlayer(playerDto) ) || [undefined, undefined];
//if player comes in to random game
		if (roomN == -1 /*&& N == undefined*/){ //
			this.addPlayer(player);
			if (this.players.length == 2){
				const playerR: UserDto = await this.userService.getUser(this.players[0].userId);
				const playerL: UserDto = await this.userService.getUser(this.players[1].userId)
				this.addNewRoom(playerR, playerL);
			}
		}
//if spectator comes to watch
		else {
			let game = this.gameMap[roomN];
			const playerDto: UserDto = await this.userService.getUser(player.userId);
			game.init(playerDto);
			game.initMoveEvents();
			this.userSockets.joinToRoom(playerDto.username, `room${roomN}`);
		}
	}

//function to process the messages "InviteGame", 'acceptGame', 'refuseGame'
	gameInvite = (author: UserDto, player: UserDto): void => {
		this.userSockets.emitToUser(author.username,'isagree', {isagree: 'waiting'} ); 
		this.invited.push({author, player});
	}

	acceptGame = (author: UserDto, player: UserDto): void => {
		if(this.searchPair(author.id, player.id)){
			// this.userSockets.emitToUser(author.username,'isagree', 'true'); 
			this.addNewRoom(author, player);
		}
	};
		
	refusalGame = (author: UserDto, player: UserDto): void => {
console.log("///////// GAME REFUSAL", author, player);
		if(this.searchPair(author.id, player.id)) {
			this.userSockets.emitToUser(author.username,'isagree', {isagree: 'false'} ); 
		};
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