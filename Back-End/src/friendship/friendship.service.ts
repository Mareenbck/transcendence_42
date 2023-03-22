import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Friendship } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FriendshipService {
	constructor(private readonly prisma: PrismaService,
				private userService: UserService) { }

	async openFriendship(requesterId: number, receiverId: number) {
		const friendship = await this.prisma.friendship.create({
			data: {
				requesterId: requesterId,
				receiverId: receiverId,
			},
		});
		console.log("friendship--->");
		console.log(friendship);
		return friendship
	}

	async getReceivedFriendships(userId: any) {
		const { id } = userId;
		try {
		  const user = await this.userService.getUser(parseInt(id));
		  const demands = await this.prisma.friendship.findMany({
			where: {
				receiverId: user.id,
			  },
			  include: {
				requester: true,
			  },
		  })
		  return demands;
		} catch (error) {
		  throw new BadRequestException('getReceivedFriendships error : ' + error);
		}
	  }

// 	async getUsers() {
// 		const allUsers = await this.prisma.user.findMany();
// 		return allUsers;
// 	}

// 	async getUser(id: number) {
// 		if (id === undefined) {
// 			throw new BadRequestException('Undefined user ID');
// 		}
// 		try {
// 			const user = await this.prisma.user.findUniqueOrThrow({
// 				where: {
// 					id: id,
// 				},
// 			});
// 			const userDTO = plainToClass(UserDto, user);
// 			return userDTO;
// 		} catch (error) {
// 			throw new BadRequestException('getUser error : ' + error);
// 		}
// 	}

// 	async getByEmail(email: string): Promise<User | null> {
// 		const user = await this.prisma.user.findUnique({
// 			where: {
// 				email: email,
// 			},
// 		});
// 		return user;
// 	}

// 	async set2FASecretToUser(secret: string, email: string) {
// 		return this.prisma.user.update({
// 			where: { email: email },
// 			data: { twoFAsecret: secret },
// 		});
// 	}

// 	async turnOn2FA(email: string) {
// 		return this.prisma.user.update({
// 			where: { email: email },
// 			data: { twoFA: true },
// 		});
// 	}

// 	async turnOff2FA(email: string) {
// 		return this.prisma.user.update({
// 			where: { email: email },
// 			data: { twoFA: false },
// 		});
// 	}

// 	async updateUsername(id: string, newUsername: string) {
// 		const updateUser = await this.prisma.user.update({
// 			where: {
// 				id: parseInt(id),
// 			},
// 			data: {
// 				username: newUsername,
// 			},
// 		});
// 		return updateUser;
// 	}

// 	async updateAvatar(id: number, newAvatar: string) {
// 		const updateUser = await this.prisma.user.update({
// 			where: {
// 				id: id,
// 			},
// 			data: {
// 				avatar: newAvatar,
// 			},
// 		});
// 		return updateUser;
// 	}

// 	async restoreAvatar(id: number) {
// 		const updateUser = await this.prisma.user.update({
// 			where: {
// 				id: id,
// 			},
// 			data: {
// 				avatar: '',
// 			},
// 		});
// 		return updateUser;
// 	}

//   async getFriends(userId: number) {
//     if (userId === undefined || isNaN(userId) ) {
//       throw new BadRequestException('Undefined user for Friends');
//     }
//     try {
//       const user = await this.prisma.user.findUniqueOrThrow({
//         where: {id: userId, },
//       });
//       console.log(user)


//  //     const friends = user.friendsTo.map((friendId) => {
//  //       return this.getUser(friendId);
//  //     })
//   //    let friendList = [];
//   //    friends.map((friend) => {const {id, username, avatar} = friend;
//   //      friendList.push({id, username, avatar});
//   //    });
//   //    return friendList;
//     } catch (error) {
//       throw new BadRequestException('getUser error : ' + error);
//     }
//   }

}
