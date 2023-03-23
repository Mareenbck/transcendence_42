import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChatroom2Dto, CreateRoomDto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';

@Injectable()
export class Chatroom2Service {
  constructor(private prisma: PrismaService){}

  async create(createChatroom2Dto: CreateRoomDto) {
      const {name}=createChatroom2Dto;
       return await this.prisma.chatroom.create({data: {
        name: name,
        avatar: "http://localhost:8080/public/images/news.jpeg",
        status: status
      }});
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
