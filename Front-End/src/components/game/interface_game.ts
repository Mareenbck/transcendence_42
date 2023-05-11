export interface UserGame {
	id: number;
	username: string;
	email: string;
    hash: string;
	avatar: string;
	ftAvatar: string;
	is2FA: boolean;
};

export interface gamesList{
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

export interface gameState {
    racket1: racket;
    racket2: racket;
    ball: ball;
    scoreR: number;
    scoreL: number
}

export interface gameInit {
    table_width: number;
    table_height: number;
    racket_width: number;
    racket_height: number;
    ballR: number;
    scoreR: number;
    scoreL: number;
}

export interface gameStatus {
    winner: UserGame;
    playerR: UserGame;
    playerL: UserGame;
    player: UserGame;
    status: string;
}

export interface players {
    playerR: UserGame;
    playerL: UserGame;
}
