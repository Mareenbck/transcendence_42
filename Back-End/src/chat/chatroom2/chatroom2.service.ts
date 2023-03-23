import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, Injectable} from '@nestjs/common';
import { Chatroom } from '@prisma/client';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';

@Injectable()
export class ChatroomService {
  constructor(private prisma: PrismaService){}

  create({name, avatar}) {
    return this.prisma.chatroom.create({data: {
        name: name,
        avatar: "http://localhost:8080/public/images/news.jpeg"
    }});
  }

  findAll() {
    return this.prisma.chatroom.findMany();
  }

  findSome(me: number, friend: number) {
    return this.prisma.chatroom.findMany({
    });
  }
}
