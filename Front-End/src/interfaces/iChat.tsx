export default interface DirMess 
{
    id: number;
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

export interface ChatRoom {
  id: number;
  name:  string;
  isPublic: boolean;
  isPrivate: boolean;
  isProtected: boolean;
};

export interface UserChat {
	id: number;
	username: string;
	email: string;
	avatar: string;
	ftAvatar: string;
  blockedTo: UserChat[];
  blockedFrom: UserChat[];
	dirMessEmited: DirectMessage[];
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

export interface Invite {
    authorId: number;
    playerId: number;
};

export interface UserInRoom {
  userId: number;
  roomId: number;
};

export interface ToBlock {
  blockTo: number;
  blockFrom: number;
};
