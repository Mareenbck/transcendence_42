import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { Prisma, UserChannelVisibility } from '@prisma/client';
import { UserRoleInChannel} from '@prisma/client'
import { UserStatusOnChannel } from '@prisma/client'
import { BadRequestException, Injectable} from '@nestjs/common';
import { Chatroom } from '@prisma/client';
import { UserOnChannel} from '@prisma/client'
import * as argon from 'argon2';


@Injectable()
export class ChatroomService {
  constructor(private prisma: PrismaService){}

    async create(newConv: any, userId: number) {
      const { name, isPublic, isPrivate, isProtected, password } = newConv;
      let visibility: UserChannelVisibility;
      if (isPrivate) {
        visibility = UserChannelVisibility.PRIVATE;
      } else if (isPublic) {
        visibility = UserChannelVisibility.PUBLIC;
      } else if (isProtected) {
        visibility = UserChannelVisibility.PWD_PROTECTED;
      }

      const hash = await argon.hash(password);

      if (visibility === UserChannelVisibility.PWD_PROTECTED) {
        data['hash'] = password;
      }
      
      const newChannel = await this.prisma.chatroom.create({
        data: {
          name: name,
          visibility: visibility,
        },
      });
      const userOnChannel = await this.prisma.userOnChannel.create({
        data: {
          channelId: newChannel.id,
          userId: userId,
          role: "ADMIN"
        }
      });
      return newChannel;
  }


  async createUserTable(ids: any)
  {
    const {userId, channelId} = ids;
    try {
      const newTable = await this.prisma.userOnChannel.create({
        data: {
          channelId: channelId,
          userId: userId,
        }
      })
      return newTable;
    } catch (err) {
      console.log(err);
    }
  }

  findAll() {
    return this.prisma.chatroom.findMany();
  }

  findOne(id: number) {
    return this.prisma.chatroom.findUnique({where: {id: id}});;
  }

  async getUserTable(userId: number, channelId: number) {
    const users = await this.prisma.userOnChannel.findMany( {where: 
        {
          AND: [

            {userId:userId},
            {channelId: channelId},
          ],
        }})
    return users;
  }
  
}
