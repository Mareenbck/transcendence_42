import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChatroom2Dto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';

@Injectable()
export class Chatroom2Service {
  constructor(private prisma: PrismaService){}

  create(createChatroom2Dto: CreateChatroom2Dto) {
       return this.prisma.chatroom.create({data: CreateChatroom2Dto});
  }

  findAll() {
    return this.prisma.chatroom.findMany();
  }

  findOne(id: number) {
    return this.prisma.chatroom.findUnique({where: {id: id}});;
  }

  update(id: number, updateChatroom2Dto: UpdateChatroom2Dto) {
    return this.prisma.chatroom.update({
      where: {id: id},
      data: updateChatroom2Dto });
  }

  remove(id: number) {
    return this.prisma.chatroom.delete({where: {id: id}});;
  }
}
