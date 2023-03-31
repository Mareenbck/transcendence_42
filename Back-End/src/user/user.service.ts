import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';


@Injectable()
export class UserService {
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
		const allUsers = await this.prisma.user.findMany({
    });
		return allUsers;
	}

  async getUsersWithBlocked() {
    const allUsers = await this.prisma.user.findMany({
      include: { blockedFrom: true, blockedTo: true }
    });
    return allUsers;
  }

  async getUsersWithGames() {
   const allUsers = await this.prisma.user.findMany({
      include: { playerOne: true, playerTwo: true, winner: true }
    });
    return allUsers;
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

  async getFriends(userId: number) {
    if (userId === undefined || isNaN(userId) ) {
      throw new BadRequestException('Undefined user for Friends');
    }
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {id: userId, },
      });
      console.log(user)


 //     const friends = user.friendsTo.map((friendId) => {
 //       return this.getUser(friendId);
 //     })
  //    let friendList = [];
  //    friends.map((friend) => {const {id, username, avatar} = friend;
  //      friendList.push({id, username, avatar});
  //    });
  //    return friendList;
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
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: id1 },
				include: { friends: true, friendOf: true }
				});
			if (!user) {
				throw new Error(`User with id ${id1} not found.`);
			}
			const updatedFriends = user.friends.filter((friend) => friend.id !== id2);
			const updatedUser = await this.prisma.user.update({
				where: { id: id1 },
				data: { friendOf: { set: updatedFriends } },
			  });
			return updatedUser;
		} catch (error) {
			console.error(error);
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
