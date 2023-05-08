import { UserDto } from "src/user/dto/user.dto";

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
 
// export enum GameStatus {
// 	STARTING = 'starting',
// 	PLAYING = 'playing',
// 	ENDED = 'ended',
// 	ABORTED = 'aborted',
// }


export const GameParams = {
	GAME_WIDTH: 1.0,
	GAME_HEIGHT: 0.5,
	RACKET_HEIGHT: 0.150,
	RACKET_WIDTH: 0.020,
	RACKET_XBOARD: 0.010,
	BALL_RADIUS: 0.015,
	RACKET_SPEED_Y: 0.005,
	BALL_DEFAULT_SPEED: 0.006,
	BALL_DELTA_SPEED: 0.0005,
	PERIOD: 50 // fps
};