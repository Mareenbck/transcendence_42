import {Server, Socket} from 'socket.io'
import { PrismaService} from '../prisma/prisma.service';
import { GameService } from 'src/game/game.service';

import {
		player,
		ball,
		gameInit,
		GameParams
	 } from './game.interfaces';
import UsersSockets from 'src/gateway/socket.class';
import { GameDto } from './dto/game.dto';


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

	private isrunning: boolean = false; 
	private interval: NodeJS.Timeout; // define the interval property
	private leave: boolean = false;
	private winner: any = '';

	private ballSpeedX = GameParams.BALL_DEFAULT_SPEED;
	private ballSpeedY = GameParams.BALL_DEFAULT_SPEED;
	private ball: ball = {x: width/2, y: height/2};

	private server: Server;
	private room: string;
	private prisma: PrismaService;
	private gameService: GameService;
	public userSockets: UsersSockets; 


	constructor(
		server: Server,
		roomN: number,
		prisma: PrismaService,
		gameService: GameService,
		userSockets: UsersSockets,
	) {
console.log("constructor Class.game");
		this.server = server;
		this.room = `room${roomN}`;
		this.prisma = prisma;
		this.userSockets = userSockets;
		this.gameService = gameService;
	}

// function: emit game - tacking the changing coordinates of rackets and ball> sends message to the room
	private emit2all(){
		this.server.to(this.room).emit('pong',
		{ // !!! sens for each room
			ball: this.ball,
			racket1: this.playerR.racket,
			racket2: this.playerL.racket,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score
		});
	}

// function: initialization of game during the ferst connection to the game
	public init(player: any){
		this.userSockets.emitToUser(player.user.username, 'init-pong', { 
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
//			> describe the movement of the ball in collisions with rackets and the edges of the playing field
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
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			++ballSpeed;
			this.ballSpeedX = ballSpeed;
		} else if (this.ball.x > width - ballR) {
			this.ballSpeedX = -this.ballSpeedX;
			++this.playerL.score;
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

// move rakets event
	public initMoveEvent(
		idPlayerR: any,
		idPlayerL: any,
	): void {
		this.playerR.user = idPlayerR;
		this.playerL.user = idPlayerL;

		this.userSockets.onFromUser(idPlayerR.user.username,'move', (message: string) => {
// console.log("game_class_playerR socket message", message);
			if (message == 'up') {
				if (this.playerR.racket.y > 0) {
					this.playerR.racket.y -= racketSpeedY;
				}
				this.emit2all();
			} else if (message == 'down') {
				if (this.playerR.racket.y < height - racket_height) {
					this.playerR.racket.y += racketSpeedY;
				}
				this.emit2all();
			}
		});
		  
		this.userSockets.onFromUser(idPlayerL.user.username,'move', (message: string) => {
// console.log("game_class_playerL socket message", message);	
			if (message == 'up') {
				if (this.playerL.racket.y > 0) {
					this.playerL.racket.y -= racketSpeedY;
				}
				this.emit2all();
			} else if (message == 'down') {
				if (this.playerL.racket.y < height - racket_height) {
					this.playerL.racket.y += racketSpeedY;
				}
				this.emit2all();
			}
		});

	}

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
			this.emit2all();
			//score MAX - change here
			if ((this.playerL.score >= 2 || this.playerR.score >= 2)){ 
				this.isrunning = false;
				this.winner =  this.playerL.score > this.playerR.score ? this.playerL.user : this.playerR.user;

///////////////////////////////////////////
// let promisses = [];
// promisses.push(
// WRITING GAME TO THE DB

console.log("237 ", {
	playerOne: {
		connect: {id: this.playerR.user.user.userId}},
	playerTwo: {
		connect: {id: this.playerL.user.user.userId}},
	winner: {
		connect: { id: this.winner.user.userId}},
		score1: this.playerR.score,
		score2: this.playerL.score,
});

				// 		this.gameService.create({
				// 		playerOneId: this.playerR.user.user.userId,
				// 		playerTwoId: this.playerL.user.user.userId,
				// 		winnerId: this.winner.user.userId,
				// 		score1: this.playerR.score,
				// 		score2: this.playerL.score,
				// });

				this.prisma.game.create({
					data: {
						playerOne: {
							connect: {id: this.playerR.user.user.userId}},
						playerTwo: {
							connect: {id: this.playerL.user.user.userId}},
						winner: {
							connect: { id: this.winner.user.userId}},
							score1: this.playerR.score,
							score2: this.playerL.score,
					}
			});
////////////////////////////////////////////////////		
				this.player_disconect(this.winner);
				clearInterval(this.interval);
// console.log("262 res ", res);
				this.playerL.score = 0;
				this.playerR.score = 0;
			}
		}, period);
	}
}

