import {time} from 'console';
import { PrismaService} from '../prisma/prisma.service';
import { 
		IProfil,
		IPlayer, 
		IBall, 
		IRacket,
		IGameState,
		IGameInit,
		getDefaultGameState } from './game.interfaces';

export class Game {
	private _prismaService: PrismaService;
	
	private _player1: IPlayer;
	private _player2: IPlayer;

	private _playersSockets: IPlayer[] = [];
	private _spectatorSockets: IProfil[] = [];

	constructor(

	) {}

	addSpectator(socket: any) {
		this._spectatorSockets.push(socket);
	}

	removeSpectator(socket: any) {
		this._spectatorSockets = this._spectatorSockets.filter(
			(s) => s !== socket,
		);
	}

	//emit game to all
	private emit2all(){
		this.server.emit('pong', {
			ball: this.ball,
			racket1: this.rackets[0],
			racket2: this.rackets[1],
			right: this.right,
			left: this.left
		}); 
	}

	//emit initial game settings
	private  socket.emit('init-pong', {
		table_width: width,
		table_height: height,
		racket_width: racket_width,
		racket_height: racket_height,
		ballR: ballR,
		right: this.right,
		left: this.left
	  });

	private updatePositions() {
	 	if (this.ball.y > this.rackets[0].y 
			&& this.ball.y < this.rackets[0].y + racket_height 
			&& this.ball.x - ballR < this.rackets[0].x + racket_width
			&& this.ballSpeedX < 0) {
				// left racket reflection
				this.ballSpeedX = -this.ballSpeedX;
				this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
	  	}
	  	else if (this.ball.y > this.rackets[1].y 
			&& this.ball.y < this.rackets[1].y + racket_height 
			&& this.ball.x + ballR > this.rackets[1].x
			&& this.ballSpeedX > 0) {
				// right racket reflection
				this.ballSpeedX = -this.ballSpeedX;
				this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
	  	}
	  
		// board reflections
		if (this.ball.x < ballR) {
			++this.right;  //left lost
console.log('left loss', this.left, this.right);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			ballSpeed = ballSpeed + 1;
			this.ballSpeedX = ballSpeed;
console.log('ballSpeed = ', ballSpeed);
	  	} 
		else if (this.ball.x > width - ballR) {
			this.ballSpeedX = -this.ballSpeedX;
			++this.left; //right lost
console.log('right loss', this.left, this.right);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = height / 2 - this.ballSpeedX;
			ballSpeed = ballSpeed + 1;
			this.ballSpeedX = - ballSpeed;
console.log('ballSpeed = ', ballSpeed);
	  	} 
		else if (this.ball.y < ballR || this.ball.y > height - ballR) {
			this.ballSpeedY = -this.ballSpeedY;
	  	}
	
		this.ball.x += this.ballSpeedX;
		this.ball.y += this.ballSpeedY;
//console.log(this.ballX, this.ballY);
	}

	private run(){
console.log("run");
		this.interval = setInterval(() => {
			this.updatePositions();
			  // Emit the updated positions of the ball and the rocket to all connected clients
			this.emit2all();
			if (this.left >= 11 || this.right >= 11){
console.log('stop game')
				clearInterval(this.interval); 
				this.isrunning = false;
				this.winner = this.left > this.right ? 'player_left' : 'player_right';
				this.server.emit('winner', {winner: this.winner})
				// this.winner = '';
				this.left = 0;
				this.right = 0;
			}
		}, period);
	}

}