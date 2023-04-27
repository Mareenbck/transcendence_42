import {Server, Socket} from 'socket.io'
import { PrismaService} from '../prisma/prisma.service';
import { GameService } from 'src/game/game.service';
import { player,
		 ball,
		 gameInit,
		 GameParams,
		 status } from './game.interfaces';
import UsersSockets from 'src/gateway/socket.class';
import { GameDto } from './dto/game.dto';
import { UserDto } from 'src/user/dto/user.dto';


var ballSpeed = GameParams.BALL_DEFAULT_SPEED;
const MAX_SCORE = 3;
const width = GameParams.GAME_WIDTH;
const height = GameParams.GAME_HEIGHT;
const racket_height = GameParams.RACKET_HEIGHT;
const racket_width = GameParams.RACKET_WIDTH;
const racketSpeedY = GameParams.RACKET_SPEED_Y;
const ballR = GameParams.BALL_RADIUS;
let period = GameParams.PERIOD


export class GameRoom {

// initialization of players (L - left, R - right)
	private playerL: player = {
		user: {} as UserDto,
		racket: {x: 10, y: (height - racket_height)/2},
		score: 0,
	};
	private playerR: player = {
		user: {} as UserDto,
		racket: {x: width - racket_width - 10, y: (height - racket_height)/2},
		score: 0,
	};

	private isrunning: boolean = false; 
	private interval: NodeJS.Timeout; // define the interval property
	private leave: boolean = false;
	private status: status = {
		winner: null,
		status: null};

	private ballSpeedX = GameParams.BALL_DEFAULT_SPEED;
	private ballSpeedY = GameParams.BALL_DEFAULT_SPEED;
	private ball: ball = {x: width/2, y: height/2};
	private rackets_ypos : [number, number] = [0, 0];
	private rackets_acel : [number, number] = [0, 0];
  
	private server: Server;
	private room: string;
	private roomN: number;
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
		this.roomN = roomN;
		this.room = `room${roomN}`;
		this.prisma = prisma;
		this.userSockets = userSockets;
		this.gameService = gameService;
	}

// function: emit game - tacking the changing coordinates of rackets and ball> sends message to the room
	private emit2all(){
		this.server.to(this.room).emit('pong',
		{ // !!! send for each room
			ball: this.ball,
			racket1: this.playerR.racket,
			racket2: this.playerL.racket,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score
		});
	}

// function: initialization of game during the ferst connection to the game
	public init(player: UserDto){
		this.userSockets.emitToUser(player.username, 'init-pong', { 
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

	public setPlayers(
		playerR: UserDto,
		playerL: UserDto,
	): void {
		this.playerR.user = playerR;
		this.playerL.user = playerL;
	}

	public checkPlayer(
		player: UserDto,
	): boolean {
		return this.playerR.user == player || this.playerL.user == player;
	}


// function: game logic ...
//			> describe the movement of the ball in collisions with rackets and the edges of the playing field
	private updatePositions(): void
	{
		this.rackets_acel[0] = this.playerL.racket.y - this.rackets_ypos[0];
		this.rackets_acel[1] = this.playerR.racket.y - this.rackets_ypos[1];
		this.rackets_ypos[0] = this.playerL.racket.y;
		this.rackets_ypos[1] = this.playerL.racket.y;

	// racket reflections
		if (this.ball.y > this.playerL.racket.y
			&& this.ball.y < this.playerL.racket.y + racket_height
			&& this.ball.x - ballR < this.playerL.racket.x + racket_width
			&& this.ballSpeedX < 0) {
	// left racket reflection
			this.ballSpeedX = -this.ballSpeedX;
//			this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
			this.ballSpeedY = Math.floor(0.4*this.rackets_acel[0] + this.ballSpeedY + 0.001*(1 - 2 * Math.random()) * ballSpeed);
		}
		else if (this.ball.y > this.playerR.racket.y
			&& this.ball.y < this.playerR.racket.y + racket_height
			&& this.ball.x + ballR > this.playerR.racket.x
			&& this.ballSpeedX > 0) {
	// right racket reflection
			this.ballSpeedX = -this.ballSpeedX;
//			this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
			this.ballSpeedY = Math.floor(0.4*this.rackets_acel[1] + this.ballSpeedY + 0.001*(1 - 2 * Math.random()) * ballSpeed);
		}
		if(Math.abs(this.ballSpeedY)>1.6*ballSpeed)
      		this.ballSpeedY = Math.sign(this.ballSpeedY)*1.6*ballSpeed;

	// board reflections
		if (this.ball.x < ballR) {
			++this.playerR.score;
			this.gameService.changeScore(this.roomN, this.playerR.score, this.playerL.score);

			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = Math.floor(Math.random() * height);
			// this.ball.y = height / 2;
			++ballSpeed;
			this.ballSpeedX = ballSpeed;
		} else if (this.ball.x > width - ballR) {
			this.ballSpeedX = -this.ballSpeedX;
			++this.playerL.score;
			this.gameService.changeScore(this.roomN, this.playerR.score, this.playerL.score);

			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = Math.floor(Math.random() * height);
			// this.ball.y = height / 2 - this.ballSpeedX;
			++ballSpeed;
			this.ballSpeedX = -ballSpeed;
//console.log('ballSpeed = ', ballSpeed);
		} else if ((this.ball.y < ballR && this.ballSpeedY < 0)
		 || (this.ball.y > height - ballR && this.ballSpeedY > 0)) {
			this.ballSpeedY = -this.ballSpeedY;
		}
			this.ball.x += this.ballSpeedX;
			this.ball.y += this.ballSpeedY;
	}

// move rakets event
	public initMoveEvents(): void {
		this.userSockets.onFromUser(this.playerR.user.username,'move', (message: string) => {
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
		  
		this.userSockets.onFromUser(this.playerL.user .username,'move', (message: string) => {
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

	private player_disconect = (user: UserDto) => {
		this.isrunning = false;
		this.status.winner = user;
		this.server.to(this.room).emit('status', {winner: this.status.winner, status: 'winner',}); //room
	}

// function: run game
	public run(): void {
console.log("game.class.run");
	//interval function: update the game at the certain period until the score reaches MAX
		this.interval = setInterval(async () => {
			this.updatePositions();
			// Emit the updated positions of the ball and the rocket to all connected clients
			this.emit2all();
			//score MAX - change here
			if ((this.playerL.score >= MAX_SCORE || this.playerR.score >= MAX_SCORE)){ 
				this.isrunning = false;
				this.status.winner =  this.playerL.score > this.playerR.score ? this.playerL.user : this.playerR.user;

///////////////////////////////////////////
// let promisses = [];
// promisses.push(
// WRITING GAME TO THE DB

				const game: GameDto = await this.gameService.create({
					playerOneId: this.playerR.user.id,
					playerTwoId: this.playerL.user.id,
					winnerId: this.status.winner.id,
					score1: this.playerR.score,
					score2: this.playerL.score,
				});

////////////////////////////////////////////////////		
				this.player_disconect(this.status.winner);
				clearInterval(this.interval);
				this.playerL.score = 0;
				this.playerR.score = 0;
				this.gameService.removeRoom(this.roomN);
			}
		}, period);
	}
}
