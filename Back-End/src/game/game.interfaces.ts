export interface IProfil{
	socket: any;
	user: any;
}

export interface IPlayer{
	
	racket: IRacket;
	score: number;
	winner: boolean;
}

export interface IBall {
	x: number;
	y: number;
}
  
export interface IRacket {
	x: number;
	y: number;
}
  
export interface IGameState {
	player1: IProfil;
	player2: IProfil;
	ball: IBall;
}
 
export interface IGameInit {
	tableWidth: number; 
	tableHeight: number;
	ballR: number;
	ballSpeed: number; 
	racketSpeedY: number;
	racketWidth: number;
	racketHeight: number;
}

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
	GAME_WIDTH: 1600, // 
	GAME_HEIGHT: 900,
	RACKET_SPEED_Y: 10,
	RACKET_HEIGHT: 120,
	RACKET_WIDTH: 10,
	BALL_RADIUS: 15,
	BALL_DEFAULT_SPEED: 7,
	PERIOD: 100
};