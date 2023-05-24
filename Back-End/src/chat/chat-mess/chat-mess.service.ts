import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { UpdateChatMessDto } from './dto/update-chatMess.dto';

@Injectable()
export class ChatMessService {
  constructor(private prisma: PrismaService){}

  async create({authorId, content, chatroomId, }) {
    let mess = null; 
    const chatroomExists = await this.prisma.chatroom.findUnique({
      where: { id: chatroomId },
    });
    if (chatroomExists) {
      mess = this.prisma.chatroomMessage.create({data: {authorId, content, chatroomId}});
    }
    return mess; 
  }

  findAll() {
    return this.prisma.chatroomMessage.findMany();
  }

  findRoom(chatroomId: number) {
    return this.prisma.chatroomMessage.findMany({
      where: {chatroomId: +chatroomId},
    });
  }
}

