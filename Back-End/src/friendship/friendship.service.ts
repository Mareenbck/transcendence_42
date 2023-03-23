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

	async updateFriendship(id: any) {
		const { demandId, response } = id
		const friendhip = await this.prisma.friendship.update({
			where: {
				id: parseInt(demandId),
			},
			data: {
				status: response,
			},
		});
		return friendhip;
	}

	async addFriend(request: any) {
		const { requesterId, receiverId } = request;
		const requester = await this.userService.getUser(parseInt(requesterId));
		const receiver = await this.userService.getUser(parseInt(receiverId));
		await this.userService.addFriendOnTable(requester.id, receiver.id)
		await this.userService.addFriendOnTable(receiver.id, requester.id)
	}

	async showFriends(userId: any){
		const { id } = userId;
		try {
			const user = await this.prisma.user.findUnique({
			where: { id: parseInt(id) },
			include: { friends: true, friendOf: true }
			});
			return user;
		} catch (error) {
			console.error(error);
		}
	}

	async findFriendship(userOne: number, userTwo: number) {
		const friendships = await this.prisma.friendship.findMany({
			where: {
				OR: [
				  { requesterId: userOne, receiverId: userTwo },
				  { requesterId: userTwo, receiverId: userOne },
				],
			  },
		  });
		const friendship = friendships[0];
		return friendship;
	}

	async findAndDeleteFriendship(userOne: number, userTwo: number) {
		const friendship = await this.findFriendship(userOne, userTwo);
		if (!friendship) {
			throw new BadRequestException('getReceivedFriendships error : ');
		}

		await this.prisma.friendship.delete({
		  where: { id: friendship.id },
		});
	}

	async deleteRefusedFriendship() {
		await this.prisma.friendship.deleteMany({
			where: { status: 'REFUSED'},
		});
	}

	async removeFriend(usersId: any) {
		const { friendId, currentId } = usersId;
		const updatedCurrent = await this.userService.removeFriendOnTable(parseInt(currentId), friendId)
		await this.userService.removeFriendOnTable(friendId, parseInt(currentId))
		await this.findAndDeleteFriendship(friendId, parseInt(currentId));
		return updatedCurrent;
	}
}
