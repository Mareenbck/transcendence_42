import {Server} from 'socket.io'
import { GameService } from 'src/game/game.service';
import { player,
		 ball,
		 GameParams,
		 winners } from './game.interfaces';
import UsersSockets from 'src/gateway/socket.class';
import { GameDto } from './dto/game.dto';
import { UserDto } from 'src/user/dto/user.dto';


var ballSpeed = GameParams.BALL_DEFAULT_SPEED;
const ballDeltaSpeed = GameParams.BALL_DELTA_SPEED;
const width = GameParams.GAME_WIDTH;
const height = GameParams.GAME_HEIGHT;
const racket_height = GameParams.RACKET_HEIGHT;
const racket_width = GameParams.RACKET_WIDTH;
const racket_xboard = GameParams.RACKET_XBOARD;
const racketSpeedY = GameParams.RACKET_SPEED_Y;
const ballR = GameParams.BALL_RADIUS;
// si tu changes MAX_SCORE il faut faire les changements dans: ./Front-End/src/components/scores/Scores.tsx et ./Front-End/src/components/scores/Table.tsx
const MAX_SCORE = 3;
const period = GameParams.PERIOD


export class GameRoom {

// initialization of players (L - left, R - right)
	private playerL: player = {
		user: {} as UserDto,
		racket: {x: racket_xboard, y: (height - racket_height)/2},
		score: 0,
	};
	private playerR: player = {
		user: {} as UserDto,
		racket: {x: width - racket_width - racket_xboard, y: (height - racket_height)/2},
		score: 0,
	};

	private interval: any; // define the interval property NodeJS.Timeout
	private winners: winners = {
		winner: null,
		playerR: {} as UserDto,
		playerL: {} as UserDto,
		};
	private status: string = 'null'
	private ballSpeedX: number = ballSpeed;
	private ballSpeedY: number = ballSpeed;
	private ball: ball = {x: width/2, y: height/2};
	private rackets_ypos : [number, number] = [0, 0];
	private rackets_acel : [number, number] = [0, 0];

	private server: Server;
	private room: string;
	public roomN: number;
	private gameService: GameService;
	public userSockets: UsersSockets;
	public isrunning: boolean = false;


	constructor(
		server: Server,
		roomN: number,
		gameService: GameService,
		userSockets: UsersSockets,
	) {
// console.log("constructor Class.game");
		this.server = server;
		this.roomN = roomN;
		this.room = `room${roomN}`;
		this.userSockets = userSockets;
		this.gameService = gameService;
		this.playerL.score = 0;
		this.playerR.score = 0;
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
		this.userSockets.emitToId(player.id, 'init-pong', {
			table_width: width,
			table_height: height,
			racket_width: racket_width,
			racket_height: racket_height,
			ballR: ballR,
			scoreR: this.playerR.score,
			scoreL: this.playerL.score,
		});
	}

	public setPlayers(
		playerR: UserDto,
		playerL: UserDto,
	): void {
		this.playerR.user = playerR;
		this.playerL.user = playerL;
	}

	public checkPlayer(player: UserDto): boolean {
		return +this.playerR.user.id == +player.id || +this.playerL.user.id == +player.id;
	}


// function: game logic ...
//			> describe the movement of the ball in collisions with rackets and the edges of the playing field
	private updatePositions(): void
	{
		this.rackets_acel[0] = this.playerR.racket.y - this.rackets_ypos[0];
		this.rackets_acel[1] = this.playerL.racket.y - this.rackets_ypos[1];
		this.rackets_ypos[0] = this.playerR.racket.y;
		this.rackets_ypos[1] = this.playerL.racket.y;

	// racket reflections
		if (this.ball.y >= this.playerL.racket.y
			&& this.ball.y <= this.playerL.racket.y + racket_height
			&& this.ball.x - ballR <= this.playerL.racket.x + racket_width
			&& this.ballSpeedX < 0) {
	// left racket reflection
			this.ballSpeedX = -this.ballSpeedX;
			this.ballSpeedY = 0.4*this.rackets_acel[0] + this.ballSpeedY + 0.002*(1 - 2 * Math.random()) * ballSpeed;
		}
		else if (this.ball.y >= this.playerR.racket.y
			&& this.ball.y <= this.playerR.racket.y + racket_height
			&& this.ball.x + ballR >= this.playerR.racket.x
			&& this.ballSpeedX > 0) {
	// right racket reflection
			this.ballSpeedX = -this.ballSpeedX;
			this.ballSpeedY = 0.4*this.rackets_acel[1] + this.ballSpeedY + 0.002*(1 - 2 * Math.random()) * ballSpeed;
		}
		if(Math.abs(this.ballSpeedY)>1.6*ballSpeed)
      		this.ballSpeedY = Math.sign(this.ballSpeedY)*1.6*ballSpeed;

	// board reflections
		if (this.ball.x < ballR) {
			++this.playerR.score;
			this.gameService.changeScore(this.roomN, this.playerR.score, this.playerL.score);

			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = (0.25 + 0.5*Math.random()) * height;
			ballSpeed += ballDeltaSpeed;
			this.ballSpeedX = ballSpeed;
		} else if (this.ball.x > width - ballR) {
			this.ballSpeedX = -this.ballSpeedX;
			++this.playerL.score;
			this.gameService.changeScore(this.roomN, this.playerR.score, this.playerL.score);
			this.ball.x = width / 2 - this.ballSpeedX;
			this.ball.y = (0.25 + 0.5*Math.random()) * height;
			ballSpeed += ballDeltaSpeed;
			this.ballSpeedX = -ballSpeed;
		} else if ((this.ball.y < ballR && this.ballSpeedY < 0)
		 || (this.ball.y > height - ballR && this.ballSpeedY > 0)) {
			this.ballSpeedY = -this.ballSpeedY;
		}
			this.ball.x += this.ballSpeedX;
			this.ball.y += this.ballSpeedY;
	}

// init move rakets event
	public initMoveEvents(): void {
		this.userSockets.onFromId(this.playerR.user.id,'move', (message: string) => {
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

		this.userSockets.onFromId(this.playerL.user.id,'move', (message: string) => {
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

	private async save_results2DB() {
		const game: GameDto = await this.gameService.create({
			playerOneId: this.playerR.user.id,
			playerTwoId: this.playerL.user.id,
			winnerId: this.winners.winner.id,
			score1: this.playerR.score,
			score2: this.playerL.score,
		});
	}

	private destroy_game(): void{
		this.isrunning = false;

		// disconnect Move Events
		this.userSockets.offFromId(this.playerR.user.id, 'move', (message: string)=>{});
		this.userSockets.offFromId(this.playerL.user.id, 'move', (message: string)=>{});

		this.gameService.updateStatusGameOver(this.playerL.user.id);
		this.gameService.updateStatusGameOver(this.playerR.user.id);

		// send winner
		this.winners.playerL = (this.playerL.user == this.winners.winner ? this.winners.winner : this.playerL.user);
		this.winners.playerR = (this.playerR.user == this.winners.winner ? this.winners.winner : this.playerR.user);
		this.server.to(this.room).emit('winner', { winner: this.winners.winner, playerR:this.winners.playerR, playerL: this.winners.playerL});

		// leave room
		this.userSockets.leaveRoom(this.room);

		// remove game by roomN
		this.gameService.removeRoom(this.roomN);
	}
			// console.log("DANS ADD LISNETAN")

// function: run game
	public run(): void {
		this.isrunning = true;

		this.gameService.updateStatusGame(this.playerL.user.id);
		this.gameService.updateStatusGame(this.playerR.user.id);
	//interval function: update the game at the certain period until the score reaches MAX
		this.interval = setInterval(() => {
			this.updatePositions();
			// Emit the updated positions of the ball and the rocket to all connected clients
			this.emit2all();
			//score MAX - change here
			if ((this.playerL.score >= MAX_SCORE || this.playerR.score >= MAX_SCORE)){
				clearInterval(this.interval);
				this.winners.winner =  this.playerL.score > this.playerR.score ? this.playerL.user : this.playerR.user;
//////////////////// to DB /////////////////////////
				this.save_results2DB();
////////////////////////////////////////////////////
				this.destroy_game();
				this.interval = null;
			}
		}, period);
	}

	// exit Game if exit buttonis pressed
	public exitGame(player: UserDto): void {
		clearInterval(this.interval);
		if (player.id == this.playerR.user.id){
			this.playerL.score = MAX_SCORE;
			this.winners.winner =  this.playerL.user;
		}
		else {
			this.playerR.score = MAX_SCORE;
			this.winners.winner =  this.playerR.user;
		}

		this.save_results2DB();
		this.destroy_game();
		this.interval = null;
	}
}
