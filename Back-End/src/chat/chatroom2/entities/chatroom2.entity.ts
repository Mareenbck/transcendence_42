import { Chatroom, Prisma } from "@prisma/client";

export class ChatroomEntity implements Chatroom {
  id:      number;
  name:    string;
  avatar: string;
}
