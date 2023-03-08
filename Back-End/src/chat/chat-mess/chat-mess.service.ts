import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { UpdateChatMessDto } from './dto/update-chatMess.dto';

@Injectable()
export class ChatMessService {
/*
  constructor(private prisma: PrismaService){}

  create(createChatMessDto: CreateChatMessDto) {
       return this.prisma.chatroomMessage.create({data: createChatMessDto});
  }

  findAll() {
    return this.prisma.chatroomMessage.findMany();
  }

  findOne(id: number) {
    return this.prisma.chatroomMessage.findUnique({where: {id: id}});;
  }

  update(id: number, updateChatMessDto: UpdateChatMessDto) {
    return this.prisma.chatroomMessage.update({
      where: {id: id},
      data: updateChatMessDto });
  }

  remove(id: number) {
    return this.prisma.chatroomMessage.delete({where: {id: id}});;
  }

  findRoom(chatroomId: number) {
    return this.prisma.chatroomMessage.findMany({
      where: {chatroomId: chatroomId},
    });
  }
 */
}


