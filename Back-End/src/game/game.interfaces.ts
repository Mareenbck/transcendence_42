// import { Server, Socket } from "socket.io";

import { UserDto } from "src/user/dto/user.dto";

// export interface profile{
// 	socket: Socket; // socketId: any //socketId: any [];
// 	user: any; //userId: any
// }

export interface player{
	user: UserDto;
	racket: racket;
	score: number;
}

export interface ball {
	x: number;
	y: number;
}
  
export interface racket {
	x: number;
	y: number;
}
  
export interface gameInit {
	table_width: number;
	table_height: number;
	ballR: number;
	ballSpeed: number; 
	racketWidth: number;
	racketHeight: number;
	scoreR: number;
	scoreL: number;
//	winner: any;
}


export interface roomsList{
	roomN: number;
	playerR: UserDto;
	playerL: UserDto;
	scoreR: number;
	scoreL: number;
}

export interface invited{
	author: UserDto;
	player: UserDto;
}

export interface status{
	winner: UserDto;
	status: string;
}
// export interface IGameState {
// 	player1: IProfil;
// 	player2: IProfil;
// 	ball: IBall;
// }
 
// export enum GameStatus {
// 	STARTING = 'starting',
// 	PLAYING = 'playing',
// 	ENDED = 'ended',
// 	ABORTED = 'aborted',
// }


// const a = 1000;
const a = 1;
export const GameParams = {
	GAME_WIDTH: 1.0*a, // 
	GAME_HEIGHT: 0.5*a,
	RACKET_SPEED_Y: 0.008*a,
	RACKET_HEIGHT: 0.150*a,
	RACKET_WIDTH: 0.020*a,
	RACKET_XBOARD: 0.010*a,
	BALL_RADIUS: 0.015*a,
	BALL_DEFAULT_SPEED: 0.008*a,
	BALL_DELTA_SPEED: 0.00025*a,
	// GAME_WIDTH: 1000, // 
	// GAME_HEIGHT: 500,
	// RACKET_SPEED_Y: 8,
	// RACKET_HEIGHT: 150,
	// RACKET_WIDTH: 10,
	// BALL_RADIUS: 15,
	// BALL_DEFAULT_SPEED: 7,
	PERIOD: 100
};

