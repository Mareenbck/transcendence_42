import {RoomMessage, DirectMessage, UserChat} from "../interfaces/iChat";

export default interface DirectMessage 
{
    id: number;
    content  : string;
    author    : number;
    receiver  : number;
    createdAt: Date;
}

export default interface RoomMessage {
    id: number;
    chatroomId: number;
    content:  string;
    authorId: number;
    createdAt: Date;
};

export default interface ChatRoom {
  id: number;
  name:  string;
  isPublic: boolean;
  isPrivate: boolean;
  isProtected: boolean;
};

export default interface UserChat {
	id: number;
	username: string;
	email: string;
	avatar: string;
	ftAvatar: string;
  blockedTo: UserChat[];
  blockedFrom: UserChat[];
	dirMessEmited: DirectMessage[];
};
