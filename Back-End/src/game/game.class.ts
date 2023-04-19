import {Server, Socket} from 'socket.io'

import { PrismaService} from '../prisma/prisma.service';
import {
		player,
		ball,
		gameInit,
		GameParams
	 } from './game.interfaces';
import UsersSockets from 'src/gateway/socket.class';

var ballSpeed = GameParams.BALL_DEFAULT_SPEED;
const width = GameParams.GAME_WIDTH;
const height = GameParams.GAME_HEIGHT;
const racket_height = GameParams.RACKET_HEIGHT;
const racket_width = GameParams.RACKET_WIDTH;
const racketSpeedY = GameParams.RACKET_SPEED_Y;
const ballR = GameParams.BALL_RADIUS;
let period = GameParams.PERIOD


export class Games {

// initialization of players (L - left, R - right)
	private playerL: player = {
		user: {} as any,
		racket: {x: 10, y: (height - racket_height)/2},
		score: 0,
	};
	private playerR: player = {
		user: {} as any,
		racket: {x: width - racket_width - 10, y: (height - racket_height)/2},
		score: 0,
	};

	private isrunning: boolean = false; // define the interval property
	private interval: NodeJS.Timeout; // define the interval property
	private leave: boolean = false;

	private ballSpeedX = GameParams.BALL_DEFAULT_SPEED;
	private ballSpeedY = GameParams.BALL_DEFAULT_SPEED;
	private ball: ball = {x: width/2, y: height/2};
	private winner: any = '';

	private server: Server;
	private room: number;
	private prismaService: PrismaService;

	public userSockets: UsersSockets;

	constructor(
		server: Server,
		room: number,
		prismaService: PrismaService,
		//spectatorSockets: any[]
		userSockets: UsersSockets,
	) {
console.log("constructor Class.game");
		this.server = server;
		this.room = room;
		this.prismaService = prismaService;
		this.userSockets = userSockets;
	}

// function: emit game - tacking the changing coordinates of rackets and ball
	private emit2all(room: number){
		this.server.to(`room${room}`).emit('pong',
		{ // !!! sens for each room
			ball: this.ball,
			racket1: this.playerR.racket,
			racket2: this.playerL.racket,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score
		});
	}

// function: initialization of game // during the ferst connection to the game
	public init(user: any){
console.log("game.class: init", user);
		this.userSockets.emitToUser(user.username, 'init-pong', { 
			table_width: width,
			table_height: height,
			racket_width: racket_width,
			racket_height: racket_height,
			ballR: ballR,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score,
		//	winner: this.winner
		});
	}

// function: game logic ...
	private updatePositions(): void
	{
		if (this.ball.y > this.playerL.racket.y
			&& this.ball.y < this.playerL.racket.y + racket_height
			&& this.ball.x - ballR < this.playerL.racket.x + racket_width
			&& this.ballSpeedX < 0) {
	// left racket reflection
			this.ballSpeedX = -this.ballSpeedX;
			this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
		}
		else if (this.ball.y > this.playerR.racket.y
			&& this.ball.y < this.playerR.racket.y + racket_height
			&& this.ball.x + ballR > this.playerR.racket.x
			&& this.ballSpeedX > 0) {
	// right racket reflection
			this.ballSpeedX = -this.ballSpeedX;
			this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
		}

	// board reflections
		if (this.ball.x < ballR) {
			++this.playerR.score;
//console.log('left loss', this.playerL.score, this.playerR.score);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			++ballSpeed;
			this.ballSpeedX = ballSpeed;
//console.log('ballSpeed = ', ballSpeed);
		} else if (this.ball.x > width - ballR) {
			this.ballSpeedX = -this.ballSpeedX;
			++this.playerL.score;
//console.log('right loss', this.playerL.score, this.playerR.score);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			++ballSpeed;
			this.ballSpeedX = -ballSpeed;
//console.log('ballSpeed = ', ballSpeed);
		} else if (this.ball.y < ballR || this.ball.y > height - ballR) {
			this.ballSpeedY = -this.ballSpeedY;
		}
			this.ball.x += this.ballSpeedX;
			this.ball.y += this.ballSpeedY;
	}

//function: move rackets
// 	private player_move = (message: string, player: player) => {
// console.log("playerR move", message);
// 		if (message == 'up') {
// 			if (player.racket.y > 0) {
// 				player.racket.y -= racketSpeedY;
// 			}
// 			this.emit2all();
// 		} else if (message == 'down') {
// 			if (player.racket.y < height - racket_height) {
// 				player.racket.y += racketSpeedY;
// 			}
// 			this.emit2all();
// 		}
// 	};

// move rakets event
	public initMoveEvent(
		idPlayerR: any,
		idPlayerL: any,
	): void {
		this.playerR.user = idPlayerR;
		this.playerL.user = idPlayerL;
		this.isrunning = true;

		// const socketR = this.server.sockets.sockets.get(idPlayerR.socketId);
		// const socketL = this.server.sockets.sockets.get(idPlayerL.socketId); 
		this.userSockets.onFromUser(idPlayerR.user.username,'move', (message: string) => {
	console.log("game_class_playerR socket message", message);
	let socket =  this.userSockets.getUserSockets(idPlayerR.user.username)[0];
			if (message == 'up') {
				if (this.playerR.racket.y > 0) {
					this.playerR.racket.y -= racketSpeedY;
				}
				this.emit2all(this.room);
			} else if (message == 'down') {
				if (this.playerR.racket.y < height - racket_height) {
					this.playerR.racket.y += racketSpeedY;
				}
				this.emit2all(this.room);
			}
		});
		  
		this.userSockets.onFromUser(idPlayerL.user.username,'move', (message: string) => {
console.log("game_class_playerL socket message", message);	
			if (message == 'up') {
				if (this.playerL.racket.y > 0) {
					this.playerL.racket.y -= racketSpeedY;
				}
				this.emit2all(this.room);
			} else if (message == 'down') {
				if (this.playerL.racket.y < height - racket_height) {
					this.playerL.racket.y += racketSpeedY;
				}
				this.emit2all(this.room);
			}
		});

	}
// //handling disconection
// 		socketR?.on('disconect', () => {
// 	console.log("playerR disconect");
// 			this.player_disconect(this.playerL.profile.user.userId);
// 			clearInterval(this.interval);
// 			this.isrunning = false;
// 		})

// 		socketL?.on('disconect', () => {
// 	console.log("playerL disconect");
// 			this.player_disconect(this.playerR.profile.user.userId);
// 			clearInterval(this.interval);
// 			this.isrunning = false;
// 		})
	private player_disconect = (user: any) => {
		this.isrunning = false;
		this.winner = user;
		this.server.emit('winner', {winner: this.winner, leave: this.leave});
	}

// function: run game
	public run(): void {
console.log("game.class.run");
	//interval function: update the game at the certain period until the score reaches MAX
		this.interval = setInterval(() => {
			this.updatePositions();
			// Emit the updated positions of the ball and the rocket to all connected clients
			this.emit2all(this.room);
console.log("position ball x y", this.ball.x, this.ball.y);
console.log("position requet", this.playerR.racket, this.playerL.racket);
console.log("position score", this.playerR.score, this.playerL.score);

			if ((this.playerL.score >= 2 || this.playerR.score >= 2)){ //score MAX - change here

				this.isrunning = false;
				this.winner =  this.playerL.score > this.playerR.score ? this.playerL.user : this.playerR.user;
				this.player_disconect(this.winner);
				clearInterval(this.interval);

				if (!this.isrunning){
				// let promisses = [];
				// promisses.push(
					this.prismaService.game.create({
						data: {
							playerOne: {
								connect: {id: this.playerR.user.userId}},
							playerTwo: {
								connect: {id: this.playerL.user.userId}},
							winner: {
								connect: { id: this.winner.userId}},
								score1: this.playerR.score,
								score2: this.playerL.score,
						}
					});
				}
				this.playerL.score = 0;
				this.playerR.score = 0;
			}
		}, period);
	}
}

