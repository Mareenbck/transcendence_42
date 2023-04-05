import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatroomDto, CreateRoomDto } from './dto/create-chatroom2.dto';
import { Prisma, UserChannelVisibility } from '@prisma/client';
import { UserRoleInChannel} from '@prisma/client'
import { UserStatusOnChannel } from '@prisma/client'
import { BadRequestException, Injectable} from '@nestjs/common';
import { Chatroom } from '@prisma/client';
import { UpdateChatroomDto } from './dto/update-chatroom2.dto';
import { UserOnChannel} from '@prisma/client'

@Injectable()
export class ChatroomService {
  constructor(private prisma: PrismaService){}

    async create(newConv: any) {
      const { name, isPublic, isPrivate, isProtected, role } = newConv;
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
      console.log("NEW CHANNEL")
      console.log(newChannel)
      return newChannel;
  }

  findAll() {
    return this.prisma.chatroom.findMany();
  }

  findOne(id: number) {
    return this.prisma.chatroom.findUnique({where: {id: id}});;
  }

  update(id: number, updateChatroom2Dto: UpdateChatroomDto) {
    return this.prisma.chatroom.update({
      where: {id: id},
      data: updateChatroom2Dto });
  }

  // async deleteChatroom(id: number) {
  //   return await this.prisma.chatroom.delete({ 
  //     where: { id } });
  // }
  
}
