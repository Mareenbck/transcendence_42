export default interface DirMess 
{
    id: number;
    content  : string;
    author    : number;
    receiver  : number;
    createdAt: Date;
}

export default interface ChatMess {
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
