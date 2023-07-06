import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { Prisma, UserChannelVisibility } from '@prisma/client';
import { UserRoleInChannel} from '@prisma/client'
import { UserStatusOnChannel } from '@prisma/client'
import { BadRequestException, Injectable, ForbiddenException, Logger, UnauthorizedException} from '@nestjs/common';
import { Chatroom } from '@prisma/client';
import { UserOnChannel} from '@prisma/client'
import * as argon from 'argon2';
import { Server, Socket } from "socket.io";
import { UserService } from 'src/user/user.service';
import UsersSockets from "src/gateway/socket.class";


@Injectable()
export class ChatroomService {
	public server: Server = null;
	private readonly logger = new Logger(ChatroomService.name);
	public userSockets: UsersSockets;

	constructor(private prisma: PrismaService,
				private userService: UserService) { }

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

      let hash: string = "";
      if (visibility == UserChannelVisibility.PWD_PROTECTED) {
        hash = await argon.hash(password ?? '');
      }

      const newChannel = await this.prisma.chatroom.create({
        data: {
          name: name,
          visibility: visibility,
          hash: hash,
        },
      });
      const userOnChannel = await this.prisma.userOnChannel.create({
        data: {
          channelId: newChannel.id,
          userId: userId,
          role: "OWNER"
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

  	async findOne(id: number) {
    	const chatRoom = await this.prisma.chatroom.findUnique({where: {id: id}});;
		return chatRoom
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
			throw new ForbiddenException(`Password is required`);
		}}
		return true;
	}


  async getParticipants(channelId: number) {
	if (typeof channelId !== 'number') {
		throw new Error('Invalid value for channelId');
	}
    const channel = await this.prisma.userOnChannel.findMany({
      where: { channelId },
      include: { user: true },
    });
      return channel;
  }

  async addAdmin(channelId: number, userId: number) {
	const users = await this.prisma.userOnChannel.findMany({
		where: { channelId },
		include: { user: true },
	  });
	if (!users || users.length === 0) {
	  throw new ForbiddenException(`User with ID ${userId} is not on channel with ID ${channelId}`);
	}
	const updatedrole = await this.prisma.userOnChannel.updateMany({
	  where: {
		userId, channelId,
	  },
	  data: {
		role: UserRoleInChannel.ADMIN,
	},
	});
	return channelId;
}

	async openInvitations(senderId: number, channelId: number, receiverId: number) {
		let demand;
		demand = await this.prisma.chatroomInvitations.findMany({
			where: {
				chatroomId: channelId,
				receiverId: receiverId,
			},
		});
		if (demand.length === 0) {
		demand = await this.prisma.chatroomInvitations.create({
			data: {
				senderId: senderId,
				chatroomId: channelId,
				receiverId: receiverId,
			},
			});
		}
		return demand;
	}


	async getReceivedInvitations(userId: number) {
		try {
			const demands = await this.prisma.chatroomInvitations.findMany({
			where: {
				receiverId: userId,
			},
			include: {
				chatroom: true,
			},
		})
			return demands;
		} catch (error) {
			throw new BadRequestException('getReceivedInvitations error : ' + error);
		}
	}

	async updateInvitation(invitation: any) {
		const { invitId, response } = invitation
		const updated_invitation = await this.prisma.chatroomInvitations.update({
			where: {
				id: parseInt(invitId),
			},
			data: {
				status: response,
			},
		});
		return updated_invitation;
	}

	async addChatroom(request: any) {
		const { receiverId, chatroomId } = request;
		const newTable = await this.prisma.userOnChannel.create({
			data: {
				channelId: chatroomId,
				userId: receiverId,
			},
		});
		return newTable;
	}

	async deleteRefusedInvitations() {
		await this.prisma.chatroomInvitations.deleteMany({
			where: { status: 'REJECTED' },
		});
	}

	async removeUserFromChannel(userId: number, chatroom: any) {
		const { channelId } = chatroom;
		try {
			const result = await this.prisma.userOnChannel.deleteMany({
				where: {
					AND: [
						{userId: userId},
						{channelId: channelId},
					]
				},
			});
			const chatRoomX: Chatroom = await this.findOne(channelId);
			if (chatRoomX.visibility === "PRIVATE") {
				this.deleteInvitationsForLeftRooms(channelId, userId);
			}
			return chatRoomX;
		} catch (err) {
			console.log(err);
		}
	}

	async deleteInvitationsForLeftRooms(channelId, invitedId)
	{
		await this.prisma.chatroomInvitations.deleteMany({
			where: {
				AND:[
					{chatroomId: +channelId},
					{receiverId: +invitedId},
				]
			},
		});
	}

	async updatePassword(channelId: number, newPasswordHash: any): Promise<Chatroom> {
		const {password} = newPasswordHash;
		const newpassword =  await argon.hash(password)
		const updatedChatroom = await this.prisma.chatroom.update({
		  where: { id: channelId },
		  data: { hash: newpassword},
		});
		return updatedChatroom;
	  }

	  async ban(channelId: number, userId: number) {
		  try {
			const userOnChannel = await this.prisma.userOnChannel.findFirst({
				where: {
					channelId: channelId,
					userId: userId,
				},
			});

			if (!userOnChannel) {
				throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
			}

			const updatedStatus = await this.prisma.userOnChannel.update({
				where: {
					channelId_userId: {
					  channelId,
					  userId,
					},
				  },
				data: {
					status: UserStatusOnChannel.BAN,
				},
			});
			return (updatedStatus)
		} catch (error) {
			console.error(error);
			throw new Error("Failed to ban user from channel.");
		}
	}

	async unBan(channelId: number, userId: number) {
		try {
			const userOnChannel = await this.prisma.userOnChannel.findFirst({
				where: {
					channelId: channelId,
					userId: userId,
				},
			});

			if (!userOnChannel) {
				throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
			}

			const updatedStatus = await this.prisma.userOnChannel.update({
				where: {
					channelId_userId: {
						channelId,
					  userId,
					},
				},
				data: {
					status: UserStatusOnChannel.CLEAN,
				},
			});
			return (updatedStatus)
		} catch (error) {
			console.error(error);
			throw new Error("Failed to unban user from channel.");
		}
	}

	async mute(channelId: number, userId: number) {
		try {
			const userOnChannel = await this.prisma.userOnChannel.findFirst({
				where: {
					channelId: channelId,
					userId: userId,
				},
			});

			if (!userOnChannel) {
				throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
			}

			const updatedStatus = await this.prisma.userOnChannel.update({
				where: {
					channelId_userId: {
						channelId,
						userId,
					},
				},
				data: {
					status: UserStatusOnChannel.MUTE,
				},
			});
			return updatedStatus;
		} catch (error) {
			console.error(error);
			throw new Error("Failed to mute user from channel.");
		}
	}

	async unmute(channelId: number, userId: number) {
		try {
			const userOnChannel = await this.prisma.userOnChannel.findFirst({
				where: {
					channelId: channelId,
					userId: userId,
				},
			});

			if (!userOnChannel) {
				throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
			}

			const updatedStatus = await this.prisma.userOnChannel.update({
				where: {
					channelId_userId: {
						channelId,
						userId,
					},
				  },
				data: {
					status: UserStatusOnChannel.CLEAN,
				},
			});
			return updatedStatus;
		} catch (error) {
			console.error(error);
			throw new Error("Failed to unmute user from channel.");
		}
	}

	async delete(id: number) {
		try {
			const channel = await this.prisma.chatroom.findUnique({
				where: { id },
				include: { participants: true },
			});
			if (!channel) {
				throw new Error('Channel not found');
			}
			await this.prisma.userOnChannel.deleteMany({
				where: { channelId: id },
			});
			await this.prisma.chatroomInvitations.deleteMany({
				where: { chatroomId: id },
			});
			await this.prisma.chatroomMessage.deleteMany({
				where: { chatroomId: id },
			});
			const response = await this.prisma.chatroom.delete({
				where: { id },
			});
			return response;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async kick(channelId: number, userId: number) {
	  try {
		  const userOnChannel = await this.prisma.userOnChannel.findFirst({
			  where: {
				  channelId: channelId,
				  userId: userId,
			  },
		  });

		  if (!userOnChannel) {
			  throw new Error(`User with ID ${userId} is not a member of the channel with ID ${channelId}`);
		  }

		  const deletedUserOnChannel = await this.prisma.userOnChannel.delete({
			  where: {
				  id: userOnChannel.id,
			  },
		  });

		  return deletedUserOnChannel;
	  } catch (error) {
		  console.error(error);
		  throw new Error("Failed to kick user from channel.");
	  }
	}

}
