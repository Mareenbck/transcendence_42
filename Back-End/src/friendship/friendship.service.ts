import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import path = require('path');
import { Response } from 'express';
import { Server } from "socket.io";
import UsersSockets from "src/gateway/socket.class";


@Injectable()
export class FriendshipService {
	public server: Server = null;
	private readonly logger = new Logger(FriendshipService.name);
	public userSockets: UsersSockets;
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
		await this.userService.updateAchievement(requester.id, 'Famous')
		await this.userService.updateAchievement(receiver.id, 'Famous')
	}

	async showFriends(id: string){
		// const { id } = userId;
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

	async findFriendshipById(demandId: number) {
		const friendship = await this.prisma.friendship.findUniqueOrThrow({
			where: {
				id: demandId,
			},
		});
		return friendship;
	}

	async findAndDeleteFriendship(userOne: number, userTwo: number) {
		const friendship = await this.findFriendship(userOne, userTwo);
		if (!friendship) {
			throw new BadRequestException('findAndDeleteFriendship error : ');
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
		await this.findAndDeleteFriendship(friendId, parseInt(currentId));
		return updatedCurrent;
	}

	async getUserAvatar(userId: number, res: Response) {
		try {
			const user = await this.userService.getUser(userId);
			if (user.avatar) {
				const fileName = path.basename(user.avatar)
				const result = res.sendFile(fileName, { root: process.env.UPLOAD_DIR });
				return result
			}
			else if (!user.ftAvatar && !user.avatar) {
				const fileName = process.env.DEFAULT_AVATAR;
				const result = res.sendFile(fileName, { root: process.env.PATH_DEFAULT_AVATAR });
				return result
			} else if (user.ftAvatar && !user.avatar) {
				return res.status(204).send();
			}
		} catch {
			throw new ForbiddenException('Not Found');
		}
	}
}
