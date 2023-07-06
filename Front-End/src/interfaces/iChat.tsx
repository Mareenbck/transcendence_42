export interface DirectMessage
{
    content  : string;
    author    : number;
    receiver  : number;
    createdAt: Date;
}

export interface RoomMessage {
   id: number;
    chatroomId: number;
    content:  string;
    authorId: number;
    createdAt: Date;
};

export interface Game {
  id: number;
  playerOneId: UserScore;
  playerTwoId: UserScore;
  winnerId: UserScore;
  score1: number;
  score2: number;
  createdAt: Date;
};

export interface Games {
  id: number;
  playerOneId: number;
  playerTwoId: number;
  winnerId: number;
  score1: number;
  score2: number;
  createdAt: Date;
};

export interface ChatRoom {
  id: number;
  name:  string;
  visibility: string;
};

export interface UserChat {
	id: number;
	username: string;
	email: string;
	avatar: string;
	ftAvatar: string;
  status: string;
  blockedTo: UserChat[];
  blockedFrom: UserChat[];
	dirMessEmited: DirectMessage[];
  dirMessReceived: DirectMessage[];
};

export interface UserScore {
	id: number;
	username: string;
	email: string;
	avatar: string;
	ftAvatar: string;
  playerOne: UserScore[];
  playerTwo: UserScore[];
	winner: UserScore[];
};

export interface UserCtx {
  token: string;
  userId: string;
  username: string;
  isLoggedIn: boolean;
  avatar: string;
  ftAvatar: string;
  is2FA: boolean;
}

export interface OnlineU {
  socketId: string;
  userId: UserCtx;
}

export interface Invite {
    author: UserChat;
    player: UserChat;
};

export interface UserInRoom {
  userId: number;
  roomId: number;
};

export interface ToBlock {
  blockTo: number;
  blockFrom: number;
};
