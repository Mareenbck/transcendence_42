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
	private gameId: number = 0;

//connected users> random game >:  MAX length = 2 and after paring, cleared
	private players: any[] = [];
//all connected paires [invitation author + invited] 
	private invited: invited[] = [];
//map of the games [key: N_room; game]
	private gameMap: GameRoom[] = [];
//array of the active rooms: roomN, playerR, playerL, scoreR, scoreL
	private roomArray: roomsList[] = [];
	private roomN: number = 0;

	// getPlayer:any = (username: string) => {
    //     return this.players.find(u => +u.user.username === +username);
    // }

	
// ...
	changeScore = (roomN: number, scoreR: number, scoreL: number) => {
		const index = this.roomArray.findIndex(i => i.roomN == roomN);
		if (index !== -1) {
			this.roomArray[index].scoreR = scoreR;
			this.roomArray[index].scoreL = scoreL;
			this.sendListRooms();
		}
	};

	searchPair = (author: number, player: number): boolean => {
		const index = this.invited.findIndex(i => i.author.id == author && i.player.id == player);
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
		const room = `room${this.roomN}`;
		this.userSockets.joinToRoom(playerR.username, room);
		this.userSockets.joinToRoom(playerL.username, room);
//game initialization 
		let game = new GameRoom (this.server, this.roomN, this, this.userSockets);
		if(game){
			game.init(playerR);
			game.init(playerL);
			game.setPlayers(playerR, playerL);
			game.initMoveEvents();
			this.gameMap.push(game);
			this.roomArray.push({roomN: this.roomN, playerR: playerR, playerL: playerL, scoreR: 0, scoreL: 0});
			this.players = [];
			this.sendListRooms();
			game.run();
			this.roomN++;
		}
	}

// removing room in gameMap and roomArray
	removeRoom = (roomN: number): void => {
		const room = `room${roomN}`;
		this.userSockets.leaveRoom(room);
		this.gameMap = this.gameMap.filter(i => i.roomN != roomN);
		this.roomArray = this.roomArray.filter(i => i.roomN != roomN);
		this.sendListRooms();
console.log("102 gameMap", this.gameMap);	
console.log("103 roomArray", this.roomArray);	
	}

// emit to all users in all rooms that play
	sendListRooms = () => {
		this.server.emit("gameRooms", this.roomArray); // send to Front
	}

	checkPlayerInRooms = async (player: any) => {
		const playerDto: UserDto = await this.userService.getUser(player.userId);
// find Nroom by user Dto
		let game = this.gameMap.find(game => game.checkPlayer(playerDto) );
		if (game) {
			// if exist send init
			this.playGame(playerDto, game.roomN);
		}
		else{
			// or new game
			this.playGame(playerDto, -1);
		}
	}

//after pressing "playGame" or "watch"
	playGame = async (player: any, roomN: number): Promise<void> => {
		// const playerDto: UserDto = await this.userService.getUser(player.userId);
		// // find room by user Dto
		// const [N, ] = Array.from(this.gameMap.entries()).find(([, game]) => game.checkPlayer(playerDto) ) || [undefined, undefined];
//if player comes in to random game
		if (roomN == -1){ //
			this.addPlayer(player);
			this.userSockets.emitToUser(player.username,'status', {status: 'waiting'} ); 
			if (this.players.length == 2){
				const playerR: UserDto = await this.userService.getUser(this.players[0].userId);
				const playerL: UserDto = await this.userService.getUser(this.players[1].userId);
				this.userSockets.emitToUser(playerR.username,'status', {status:'game'}); 
				this.userSockets.emitToUser(playerL.username,'status', {status:'game'}); 
				this.addNewRoom(playerR, playerL);
			}
		}
//if spectator comes to watch
		else {
			let game = this.gameMap.find(i => i.roomN == roomN);
			const playerDto: UserDto = await this.userService.getUser(player.userId);
			game.init(playerDto);
			game.initMoveEvents();
			this.userSockets.joinToRoom(playerDto.username, `room${roomN}`);
			this.userSockets.emitToUser(playerDto.username,'status', {status:'watch'}); 
		}
	}

//processing function the messages "InviteGame", 'acceptGame', 'refuseGame'
	gameInvite = (author: UserDto, player: UserDto): void => {
		this.userSockets.emitToUser(author.username,'status', {status: 'waiting'} ); 
		this.invited.push({author, player});
	}

	acceptGame = (author: UserDto, player: UserDto): void => {
		if(this.searchPair(author.id, player.id)){
			this.userSockets.emitToUser(author.username,'status', {status:'game'}); 
			this.userSockets.emitToUser(player.username,'status', {status:'game'}); 
			this.addNewRoom(author, player);
		}
	};
		
	refusalGame = (author: UserDto, player: UserDto): void => {
console.log("///////// GAME REFUSAL", author, player);
		if(this.searchPair(author.id, player.id)) {
			this.userSockets.emitToUser(author.username,'status', {status: 'false'} ); 
			this.userSockets.emitToUser(player.username,'status', {status: 'null'} ); 

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
