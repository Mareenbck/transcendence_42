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
    right: number;
    left: number
}

export interface gameInit {
    table_width: number,
    table_height: number,
    racket_width: number,
    racket_height: number,
    ballR: number
    right: number;
    left: number
}

export interface gameWinner {
    winner: string;
    leave: string;
}