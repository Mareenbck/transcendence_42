// import { Server, Socket } from "socket.io";

// export interface profile{
// 	socket: Socket; // socketId: any //socketId: any [];
// 	user: any; //userId: any
// }

export interface player{
	user: any;
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
	playerR: any;
	playerL: any;
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

// export enum GameType {
// 	RANKED = 'RANKED',
// 	FUN = 'FUN',
// }

export const GameParams = {
	GAME_WIDTH: 1000, // 
	GAME_HEIGHT: 500,
	RACKET_SPEED_Y: 5,
	RACKET_HEIGHT: 150,
	RACKET_WIDTH: 10,
	BALL_RADIUS: 15,
	BALL_DEFAULT_SPEED: 7,
	PERIOD: 100
};