import { 
	MessageBody,
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
	ConnectedSocket
  } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { PrismaService} from '../prisma/prisma.service';
import { 
		profile,
		player,
		ball,
		gameInit,
		GameParams
	 } from './game.interfaces';

		
var ballSpeed = GameParams.BALL_DEFAULT_SPEED;
const width = GameParams.GAME_WIDTH;
const height = GameParams.GAME_HEIGHT;
const racket_height = GameParams.RACKET_HEIGHT;
const racket_width = GameParams.RACKET_WIDTH;
const racketSpeedY = GameParams.RACKET_SPEED_Y;
const ballR = GameParams.BALL_RADIUS;
const period = GameParams.PERIOD


export class Game {
	private prismaService: PrismaService;

// initialization of players (L - left, R - right)
	private playerL: player = {
		profile: {} as profile, 
		racket: {x: 10, y: (height - racket_height)/2},
		score: 0,
		winner: false
	};
	private playerR: player = {
		profile: {} as profile, 
		racket: {x: width - racket_width - 10, y: (height - racket_height)/2},
		score: 0,
		winner: false
	};

//	private spectatorSockets: any[] = [];
	private isrunning: boolean = false; // define the interval property
	private interval: NodeJS.Timeout; // define the interval property
	private leave: boolean = false;

	private ballSpeedX = GameParams.BALL_DEFAULT_SPEED;
	private ballSpeedY = GameParams.BALL_DEFAULT_SPEED;
	private ball: ball = {x: width/2, y: height/2};
		
	private server: Server;

		
	constructor(
		server: Server,
		prismaService: PrismaService,
		//spectatorSockets: any[]
	) {
console.log("constructor Class.game");
		this.server = server;
		this.prismaService = prismaService;
	}

// function: emit game - tacking the changing coordinates of rackets and ball
	private emit2all(){
		this.server.emit('pong', { // !!! sens for each room
			ball: this.ball,
			racket1: this.playerR.racket,
			racket2: this.playerL.racket,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score
		}); 
	}
// function: initialization of game // during the ferst connection to the game
	public init(socket: Socket){
console.log(`init socket ${socket}`);
		socket.emit('init-pong', { 
			table_width: width,
			table_height: height,
			racket_width: racket_width,
			racket_height: racket_height,
			ballR: ballR,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score
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
console.log('left loss', this.playerL.score, this.playerR.score);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			++ballSpeed;
			this.ballSpeedX = ballSpeed;
console.log('ballSpeed = ', ballSpeed);
		} else if (this.ball.x > width - ballR) {
			this.ballSpeedX = -this.ballSpeedX;
			++this.playerL.score;
console.log('right loss', this.playerL.score, this.playerR.score);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			++ballSpeed;
			this.ballSpeedX = -ballSpeed;
console.log('ballSpeed = ', ballSpeed);
		} else if (this.ball.y < ballR || this.ball.y > height - ballR) {
			this.ballSpeedY = -this.ballSpeedY;
		}
			this.ball.x += this.ballSpeedX;
			this.ball.y += this.ballSpeedY;
	}

//function: move rackets	
	private player_move = (message: string, player: player) => {
console.log("playerR move", message);
		if (message == 'up') {
			if (player.racket.y > 0) {
				player.racket.y -= racketSpeedY;
			}
			this.emit2all();
		} else if (message == 'down') {
			if (player.racket.y < height - racket_height) {
				player.racket.y += racketSpeedY;
			}
			this.emit2all();
		}
	};

	private player_disconect = (player: player) => {
		clearInterval(this.interval);
		this.isrunning = false;
		let winner = player;
		this.server.emit('winner', {winner: winner, leave: this.leave}); // room
//!!!  BD
	}  

// function: run game
	public run(
		idPlayerR: profile,
		idPlayerL: profile,
	): void {
console.log("run");
console.log("idPlayerR", idPlayerR);
console.log("idPlayerL", idPlayerL);
		this.playerR.profile = idPlayerR;
		this.playerL.profile = idPlayerL;
		this.isrunning = true;
		


// move rakets
	const socketR = this.server.sockets.sockets.get(idPlayerR.socketId); 
	socketR.on('move', (m:string) => {this.player_move(m, this.playerR)})
	// idPlayerR.socketId.forEach((id) => {
	// 	const socket = this.server.sockets.sockets.get(id); 
	// 	socket.on('move', (m:string) => {this.player_move(m, this.playerR)})
	// });
	const socketL = this.server.sockets.sockets.get(idPlayerL.socketId); 
	socketR.on('move', (m:string) => {this.player_move(m, this.playerL)})

	// idPlayerL.socketId.forEach((id) => {
	// 	const socket = this.server.sockets.sockets.get(id); 
	// 	socket.on('move', (m:string) => {this.player_move(m, this.playerL)});
	// });

//handling disconection
	socketR?.on('disconect', () => {
console.log("playerR disconect");
		this.player_disconect(this.playerL.profile.userId);
	})

	socketL?.on('disconect', () => {
console.log("playerL disconect");
		this.player_disconect(this.playerR.profile.userId);
	})

//interval function: update the game at the certain period until the score reaches MAX
    this.interval = setInterval(() => {
		this.updatePositions();
	// Emit the updated positions of the ball and the rocket to all connected clients
		this.emit2all();
		if (this.playerL.score >= 4 || this.playerR.score >= 4){ //score MAX - change here
console.log('stop game')
			this.player_disconect(this.playerL.score > this.playerR.score ? this.playerL.profile.userId : this.playerR.profile.userId);	
		}
    }, period);
}



//   handleConnection(socket: Socket, ...args: any[]){
//     const username = socket.handshake.query.userName as string;
//     const socket = socket.id;
//     this.connectedClients = [...this.connectedClients, socket];
//     if(this.players.length < 2){
//        this.players = [...this.players, socket];
//        this.winner = '';
//        this.leave = '';
//       this.server.emit('winner', {winner: this.winner, leave: this.leave})
//     }
// console.log(`user ${username} is connected on ${socket}`);
// console.log(`Connection: connectedClients =  ${this.connectedClients} (players =  ${this.players})`);

  // emit initial game settings

}

//   handleDisconnect(socket: Socket){
//     this.connectedClients = this.connectedClients.filter(item => item != socket);
//     this.players = this.players.filter(item => item != socket);
//     this.leave = 'leave_id';
// console.log(`Disconnection: connectedClients =  ${this.connectedClients} (players =  ${this.players})`);
//     if(this.players.length == 1 ){
//       clearInterval(this.interval);
//       this.isrunning = false;
//       this.winner = 'player[0]';
//       this.server.emit('winner', {winner: this.winner, leave: this.leave})
//       // this.leave = '';
//       // this.winner = ''
//       this.scoreL = 0;
//       this.scoreR = 0;
//     }
//   } 
