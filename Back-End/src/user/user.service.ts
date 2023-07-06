import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { BadRequestException, Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import path = require('path');
import { Response } from 'express';
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";



@Injectable()
export class UserService {
	public server: Server = null;
	private readonly logger = new Logger(UserService.name);
	public userSockets: UsersSockets;

	constructor(private readonly prisma: PrismaService) { }

	async createUser(email: string, username: string, hash: string, avatar = '', ftAvatar = ''): Promise<User> {
		const user = await this.prisma.user.create({
			data: {
				email,
				username,
				hash,
				avatar,
				ftAvatar,
			},
		});
		return user;
	}

	async getUsers() {
		try {
			const allUsers = await this.prisma.user.findMany({});
		return allUsers;
	} catch (error) {
		throw new BadRequestException('getUser error : ' + error);
	}
	}

	async getUsersWithBlocked() {
		const allUsers = await this.prisma.user.findMany({
			include: { blockedFrom: true, blockedTo: true }
		});
		return allUsers;
	}

	async getMeWithBlocked(id: number) {
		const me = await this.prisma.user.findUniqueOrThrow({
			include: { blockedFrom: true, blockedTo: true },
			where: { id: id, },
		});
		return me;
	}

	async getUsersWithGames() {
		try {
   		const allUsers = await this.prisma.user.findMany({
      		include: { playerOne: true, playerTwo: true, winner: true }
    	});
    	return allUsers;
	} catch (error) {
		throw new BadRequestException('getUser error : ' + error);
	}
  	}

	async getUsersWithMessages(id: number) {
		try {
		const allUsersWithMessages = await this.prisma.user.findMany({
		  	include: {
				dirMessEmited: {
			  		where: { receiver: id }
			},
				dirMessReceived: {
			  		where: { author: id }
			},
				blockedFrom: true,
				blockedTo: true
		  	},
		  	where: {
				OR: [
			  	{ dirMessEmited: { some: { receiver: id } } },
			  	{ dirMessReceived: { some: { author: id } } }
				]
		  	}
		});
		return allUsersWithMessages;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}

	async getUser(id: number) {
		if (id === undefined) {
			throw new BadRequestException('Undefined user ID');
		}
		try {
			const user = await this.prisma.user.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			// return user;
			const userDTO = plainToClass(UserDto, user);
			return userDTO;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}

	async getAchievementById(id: number) {
		if (id === undefined) {
			throw new BadRequestException('Undefined user ID');
		}
		try {
			const achievement = await this.prisma.achievement.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			return achievement;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}

	async getUserFriendList(id: number) {
		if (id === undefined) {
			throw new BadRequestException('Undefined user ID');
		}
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				include: {
					friendOf: true
				}
			});
			return user;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}

	async getByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		return user;
	}

	async set2FASecretToUser(secret: string, email: string) {
		return this.prisma.user.update({
			where: { email: email },
			data: { twoFAsecret: secret },
		});
	}

	async turnOn2FA(email: string) {
		return this.prisma.user.update({
			where: { email: email },
			data: { twoFA: true },
		});
	}

	async turnOff2FA(email: string) {
		return this.prisma.user.update({
			where: { email: email },
			data: { twoFA: false },
		});
	}

	async updateUsername(id: string, newUsername: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: parseInt(id),
			},
			data: {
				username: newUsername,
			},
		});
		return updateUser;
	}

	async updateAvatar(id: number, newAvatar: string) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar: newAvatar,
			},
		});
		return updateUser;
	}

	async restoreAvatar(id: number) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				avatar: '',
			},
		});
		return updateUser;
	}

	async getFriends(id: number) {
		if (id === undefined) {
			throw new BadRequestException('Undefined user ID');
		}
		try {
			const user = await this.prisma.user.findUniqueOrThrow({
				where: {
					id: id,
				},
			});
			return user;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}

	async addFriendOnTable(id1: number, id2: number) {
		const updateUser = await this.prisma.user.update({
			where: {
				id: id1 ,
			},
			include: { friends: true, friendOf: true },
			data: {
				friends: { connect: { id: id2 } },
			},
		});
		return updateUser;
	}

	async removeFriendOnTable(id1: number, id2: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: id1 },
			include: { friends: true, friendOf: true },
		  });

		  if (!user) {
			throw new Error(`User with id ${id1} not found`);
		  }
		  const updatedUser = await this.prisma.user.update({
			where: { id: id1 },
			data: {
			  friends: {
				disconnect: { id: id2 },
			  },
			  friendOf: {
				disconnect: { id: id2 },
			  },
			},
			include: { friends: true, friendOf: true },
		  });
		  return updatedUser;
		}

	async getUserAchievements(id: number) {
		if (id === undefined) {
			throw new BadRequestException('Undefined user ID');
		}
		try {
			const achievements = await this.prisma.userAchievement.findMany({
				where: { userId: id },
				include: { achievement: true },
			  });
			return achievements;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}

	async getIconAchievement(achievementId: number, res: Response) {
		try {
			const achievement = await this.getAchievementById(achievementId);
			if (achievement.icon) {
				const fileName = path.basename(achievement.icon)
				const result = res.sendFile(fileName, { root: process.env.PATH_BADGE_ICON });
				return result
			}
			else {
				const fileName = process.env.DEFAULT_AVATAR;
				const result = res.sendFile(fileName, { root: process.env.PATH_DEFAULT_AVATAR });
				return result
			}
		} catch {
			throw new ForbiddenException('Not Found');
		}
	}

	async updateAchievement(userId: number, achievementName: string) {
		const achievement = await this.prisma.achievement.findUnique({
			where: { name: achievementName },
		});
		if (!achievement) {
			throw new NotFoundException('Achievement not found');
		}
		const existingUserAchievement = await this.prisma.userAchievement.findFirst({
			where: {
			  userId: userId,
			  achievementId: achievement.id,
			},
		});
		if (existingUserAchievement) {
			return null
		}
		if (!existingUserAchievement) {
			await this.prisma.userAchievement.create({
				data: {
					user: { connect: { id: userId } },
					achievement: { connect: { id: achievement.id } },
				},
			});
		}
		else {
			return null
		}
	}

  async block(blockFrom: number, blockTo: number) {
    const updateUser = await this.prisma.user.update({
      where: {
        id: +blockFrom,
      },
      data: {
        blockedTo: {
          connect: [{ id: +blockTo }],
        },
      },
      include: {
        blockedTo: true,
        blockedFrom: true,
      },
    })
    return updateUser;
  };

  async unblock(blockFrom: number, unblockTo: number) {
    const updateUser = await this.prisma.user.update({
      where: {
        id: +blockFrom,
      },
      data: {
        blockedTo: {
          disconnect: [{ id: +unblockTo }],
        },
      },
      include: {
        blockedTo: true,
        blockedFrom: true,
      },
    })
    return updateUser;
  };

}
