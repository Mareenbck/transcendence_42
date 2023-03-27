export interface profile{
	socket: any;
	userId: any;
}

export interface player{
	profil: profile;
	racket: racket;
	score: number;
	winner: boolean;
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
	// racketSpeedY: number;
	racketWidth: number;
	racketHeight: number;
	// rscoreR: number;
	// scoreL: number
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
	GAME_WIDTH: 1600, // 
	GAME_HEIGHT: 900,
	RACKET_SPEED_Y: 5,
	RACKET_HEIGHT: 120,
	RACKET_WIDTH: 10,
	BALL_RADIUS: 15,
	BALL_DEFAULT_SPEED: 7,
	PERIOD: 100
};