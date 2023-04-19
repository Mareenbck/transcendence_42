import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { Prisma, UserChannelVisibility } from '@prisma/client';
import { UserRoleInChannel} from '@prisma/client'
import { UserStatusOnChannel } from '@prisma/client'
import { BadRequestException, Injectable, ForbiddenException} from '@nestjs/common';
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

      console.log("au dessus du hash")
      let hash: string = "";
      if (visibility == UserChannelVisibility.PWD_PROTECTED) {
        hash = await argon.hash(password ?? '');
      }
      console.log("hash service --->", hash)

      const newChannel = await this.prisma.chatroom.create({
        data: {
          name: name,
          visibility: visibility,
          hash: hash,
        },
      });
      // console.log("newChannel----->", newChannel);
      const userOnChannel = await this.prisma.userOnChannel.create({
        data: {
          channelId: newChannel.id,
          userId: userId,
          role: "ADMIN"
        }
      });
      return newChannel;
  }

	findAll() {
		return this.prisma.chatroom.findMany({
			include: {
				participants: true,
			},
		});
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

	async createUserTable(ids: any, hash: string) {
		const { userId, channelId } = ids;
		if (hash) {
			console.log("DANS LE IF DU CREATE USER TABLE")
			await this.validatePassword(channelId, hash);
		}
		try {
			const newTable = await this.prisma.userOnChannel.create({
				data: {
					channelId: channelId,
					userId: userId,
				},
			});
			return newTable;
		} catch (err) {
			console.log(err);
		}
	}

	async validatePassword(id: number, hash: string): Promise<boolean> {
		const channel = await this.prisma.chatroom.findUnique({ where: { id: id } });
		if (channel.visibility === UserChannelVisibility.PWD_PROTECTED) {
			if (!hash) {
				throw new ForbiddenException(`Password is required`);
			}
		const isPasswordMatch = await argon.verify(channel.hash, hash);
		if (!isPasswordMatch) {
			throw new ForbiddenException(`Invalid password`);
		}}
		return true;
	}


	async openInvitations(senderId: number, channelId: number, receiverId: number) {
		const demand = await this.prisma.chatroomInvitations.create({
			data: {
				senderId: senderId,
				chatroomId: channelId,
				receiverId: receiverId,
			},
		});
		return demand
	}


	// async getReceivedDemands(userId: number) {
	// 	try {
	// 		// const user = await this.userService.getUser(userId);
	// 		const demands = await this.prisma.channelRequest.findMany({
	// 		where: {
	// 			userId: userId,
	// 		},
	// 		include: {
	// 			channel: true,
	// 		},
	// 	})
	// 		return demands;
	// 	} catch (error) {
	// 		throw new BadRequestException('getReceivedFriendships error : ' + error);
	// 	}
	// }


}
