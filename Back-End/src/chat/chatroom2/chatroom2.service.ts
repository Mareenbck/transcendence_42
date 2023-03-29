import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateChatroom2Dto, CreateRoomDto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';
import { Prisma, UserChannelVisibility } from '@prisma/client';


@Injectable()
export class Chatroom2Service {
  constructor(private prisma: PrismaService){}

    async create(newConv: any) {
      const { name, avatar, isPublic, isPrivate, isProtected } = newConv;
      let visibility: UserChannelVisibility;
      if (isPrivate) {
        visibility = UserChannelVisibility.PRIVATE;
      } else if (isPublic) {
        visibility = UserChannelVisibility.PUBLIC;
      } else if (isProtected) {
        visibility = UserChannelVisibility.PWD_PROTECTED;
      }
  
      console.log('CREATE CHATROOMDTO');
      console.log(newConv);
      const newChannel = await this.prisma.chatroom.create({
        data: {
          name: name,
          visibility: visibility,
        },
      });
      return newChannel;
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

  // async deleteChatroom(id: number) {
  //   return await this.prisma.chatroom.delete({ 
  //     where: { id } });
  // }
  
}
