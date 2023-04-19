export interface player{
    socket: any;
	userId: any;
}

export interface gamesList{
    roomN: number;
	playerR: any;
	playerL: any;
}

// export interface profile{
// 	socketId: any; //socketId: any [];
// 	userId: any;
// }

// export interface player{
// 	profile: profile;
// 	racket: racket;
// 	score: number;
// }

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
    table_width: number,
    table_height: number,
    racket_width: number,
    racket_height: number,
    ballR: number
    scoreR: number;
    scoreL: number
}

export interface gameWinner {
    winner: any;
    leave: string;
}

export interface star {
    centerX: number;
    centerY: number; // the center point of the star
    points: number; //the number of points on the exterior of the star
    inner: number;//the radius of the inner points of the star
    outer: number;//the radius of the outer points of the star
    fill: string;
    stroke: string;//the fill and stroke colors to apply
    line: number; //the linewidth of the stroke
}

export  interface backColorGame{
    backColorGame: string;
}

export interface Invite{
    author: player;
	invite: player;
}