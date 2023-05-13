export enum GameStatus {
    NULL = 1,
    WAIT,
    GAME,
    WATCH,
    CLOSE,
}

export interface UserGame {
	id: number;
	username: string;
	email: string;
    hash: string;
	avatar: string;
	ftAvatar: string;
	is2FA: boolean;
};

export interface GamesList{
    roomN: number;
	playerR: UserGame;
	playerL: UserGame;
    scoreR: number;
    scoreL: number;
}

export interface ball {
    x: number;
    y: number;
}

export interface racket {
    x: number;
    y: number;
}

export interface GameState {
    racket1: racket;
    racket2: racket;
    ball: ball;
    scoreR: number;
    scoreL: number
}

export interface GameInit {
    table_width: number;
    table_height: number;
    racket_width: number;
    racket_height: number;
    ballR: number;
    scoreR: number;
    scoreL: number;
}

export interface GameWinner {
    winner: UserGame | null;
    playerR: UserGame;
    playerL: UserGame;
}

