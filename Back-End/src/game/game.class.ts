import {time} from 'console';
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
		racket,
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

	private playerR: player;
	private playerL: player;

	private idPlayerR: profile;
	private idPlayerL: profile;

	private spectatorSockets: any[] = [];
	private isrunning: boolean = false; // define the interval property
	private interval: NodeJS.Timeout; // define the interval property
	private ballSpeedX = GameParams.BALL_DEFAULT_SPEED;
	private ballSpeedY = GameParams.BALL_DEFAULT_SPEED;
	
	private ball: ball = {x: width/2, y: height/2};
	private racketL: racket = {x: 10, y: (height - racket_height)/2};
	private racketR: racket = {x: width - racket_width - 10, y: (height - racket_height)/2};	
  
	//initialisation score
	private scoreR : number = 0;
	private scoreL : number = 0;
	private winner: string = '';
	private leave: boolean = false;
	server: any;
	socket: any;
	
	constructor(
		idPlayerR: profile,
		idPlayerL: profile,
		prismaService: PrismaService,
	) {
		this.idPlayerR = idPlayerR;
		this.idPlayerL = idPlayerL;
		this.prismaService = prismaService;
	}


//emit game 
	private emit2all(){
		this.server.emit('pong', {
		ball: this.ball,
		racket1: this.racketR,
		racket2: this.racketL,
		scoreR: this.scoreR,
		scoreL: this.scoreL
		}); 
	}

	private init(){
		this.socket.emit('init-pong', {
			table_width: width,
			table_height: height,
			racket_width: racket_width,
			racket_height: racket_height,
			ballR: ballR,
			scoreR: this.scoreR,
			scoreL: this.scoreL
		});
	}

private updatePositions(): void
{
  if (this.ball.y > this.racketL.y 
    && this.ball.y < this.racketL.y + racket_height 
    && this.ball.x - ballR < this.racketL.x + racket_width
    && this.ballSpeedX < 0) {
    // left racket reflection
    this.ballSpeedX = -this.ballSpeedX;
    this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
  }
  else if (this.ball.y > this.racketR.y 
    && this.ball.y < this.racketR.y + racket_height 
    && this.ball.x + ballR > this.racketR.x
    && this.ballSpeedX > 0) {
    // right racket reflection
    this.ballSpeedX = -this.ballSpeedX;
    this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
  }
  
  // board reflections
  if (this.ball.x < ballR) {
    ++this.scoreR;
console.log('left loss', this.scoreL, this.scoreR);
    this.ball.x = width / 2 - this.ballSpeedX;
    this.ball.y = height / 2 - this.ballSpeedX;
    ballSpeed = ballSpeed + 1;
    this.ballSpeedX = ballSpeed;
console.log('ballSpeed = ', ballSpeed);
  } else if (this.ball.x > width - ballR) {
    this.ballSpeedX = -this.ballSpeedX;
    ++this.scoreL;
console.log('right loss', this.scoreL, this.scoreR);
    this.ball.x = width / 2 - this.ballSpeedX;
    this.ball.y = height / 2 - this.ballSpeedX;
    ballSpeed = ballSpeed + 1;
    this.ballSpeedX = - ballSpeed;
console.log('ballSpeed = ', ballSpeed);
  } else if (this.ball.y < ballR || this.ball.y > height - ballR) {
    this.ballSpeedY = -this.ballSpeedY;
  }

  this.ball.x += this.ballSpeedX;
  this.ball.y += this.ballSpeedY;
//console.log(this.ballX, this.ballY);
}
    
public run(): void {
console.log("run");
// move rackets
	this.playerR.profil.socket.on('move', (message: string) => {
		console.log("playerR move", message);
		if (message == 'up') {
			if (this.racketR.y > 0) {
			this.racketR.y -= racketSpeedY;
			}
			this.emit2all();
		} else if (message == 'down') {
			if (this.racketR.y < height - racket_height) {
			this.racketR.y += racketSpeedY;
			}
			this.emit2all();
		}
	})
	this.playerL.profil.socket.on('move', (message: string) => {
		console.log("playerL move", message);
		if (message == 'up') {
			if (this.racketL.y > 0) {
			this.racketL.y -= racketSpeedY;
			}
			this.emit2all();
		} else if (message == 'down') {
			if (this.racketL.y < height - racket_height) {
			this.racketL.y += racketSpeedY;
			}
			this.emit2all();
		}
	})

//disconect
	this.playerR.profil.socket.on('disconect', () => {
		console.log("playerR disconect");
		clearInterval(this.interval);
		this.isrunning = false;
		let winner = this.playerL.profil.userId;
		this.server.emit('winner', {winner: winner, leave: this.leave});
	})

	this.playerL.profil.socket.on('disconect', () => {
		console.log("playerL disconect");
		clearInterval(this.interval);
		this.isrunning = false;
		let winner = this.playerR.profil.userId;
		this.server.emit('winner', {winner: winner, leave: this.leave});
	})


    this.interval = setInterval(() => {
      this.updatePositions();
      // Emit the updated positions of the ball and the rocket to all connected clients
      this.emit2all();
      if (this.scoreL >= 11 || this.scoreR >= 11){
console.log('stop game')
        clearInterval(this.interval); 
        this.isrunning = false;
        let winner = this.scoreL > this.scoreR ? this.playerL.profil.userId : this.playerR.profil.userId;
        this.server.emit('winner', {winner: winner})
        // this.winner = '';
        this.scoreL = 0;
        this.scoreR = 0;
      }
    }, period);
  }




  /*
@SubscribeMessage('move')
onChgEvent(
  @MessageBody() message: string,
  @ConnectedSocket() client: Socket
): void {
  
  const player = this.players.indexOf(client);
  if(player == -1) return;
console.log(`message ${message} from ${client} (${player})`);
  if (message == 'up') {
    if (this.rackets[player].y > 0) {
      this.rackets[player].y -= racketSpeedY;
    }
    this.emit2all();

  } else if (message == 'down') {
    if (this.rackets[player].y < height - racket_height) {
      this.rackets[player].y += racketSpeedY;
    }
    this.emit2all();
  }
  else if (message == 'start' && !this.isrunning && this.players.length == 2) {
    this.isrunning = true;
    this.run();
  }  
}
*/

//   handleConnection(socket: Socket, ...args: any[]){
//     const username = socket.handshake.query.userName as string;
//     const socketId = socket.id;
//     this.connectedClients = [...this.connectedClients, socket];
//     if(this.players.length < 2){
//        this.players = [...this.players, socket];
//        this.winner = '';
//        this.leave = '';
//       this.server.emit('winner', {winner: this.winner, leave: this.leave})
//     }
// console.log(`user ${username} is connected on ${socketId}`);
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
