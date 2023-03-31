import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { UpdateChatMessDto } from './dto/update-chatMess.dto';

@Injectable()
export class ChatMessService {
  constructor(private prisma: PrismaService){}

  create({authorId, content, chatroomId, }) {
    return this.prisma.chatroomMessage.create({data: {authorId, content, chatroomId, }});
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

