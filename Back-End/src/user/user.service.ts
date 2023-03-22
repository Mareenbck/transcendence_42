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
		const allUsers = await this.prisma.user.findMany();
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

}
