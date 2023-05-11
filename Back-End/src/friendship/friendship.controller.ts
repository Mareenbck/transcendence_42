import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard, FortyTwoAuthGuard, JwtGuard, LocalAuthGuard } from 'src/auth/guard';
import { FriendshipService } from './friendship.service';
import { GetCurrentUserId } from '../decorators/get-userId.decorator';
import { FriendsDto } from './dto/friends.dto';
import { GetUser } from 'src/auth/decorator';
import path = require('path');
import { UserService } from 'src/user/user.service';
import { Response } from 'express';


@Controller('friendship')
export class FriendshipController {
	constructor(private friendshipService: FriendshipService,
				private userService: UserService) { }

	@Post('/create')
	async openFriendship(@Body() usersId: any) {
		//creation d une friendship dans database
		const { requesterId, receiverId } = usersId;
		const newFriendship = await this.friendshipService.openFriendship(parseInt(requesterId), receiverId);
		return newFriendship;
	}

	@Post('received')
	async getReceived(@Body() userId: number) {
		const demands = await this.friendshipService.getReceivedFriendships(userId);
		return demands;
	}

	@Post('friends')
	async showFriends(@Body() userId: any){
		const { id } = userId;
		console.log("CONTROLLER FRIEND")
		const friends = await this.friendshipService.showFriends(id);
		return friends.friendOf
	}

	@Post('update')
	async updateDemand(@Body() demand: any) {
		const result = await this.friendshipService.updateFriendship(demand);
		if (result.status === 'ACCEPTED') {
			await this.friendshipService.addFriend(result);
		}
		else if (result.status === 'REFUSED') {
			await this.friendshipService.deleteRefusedFriendship();
		}
		return result;
	}

	@Post('/delete')
	async deleteFriend(@Body() usersId: number) {
		const user = this.friendshipService.removeFriend(usersId);
		return user;
	}

	@Get('/:id/avatar')
	async getAvatar(@Param('id') id: string, @Res() res: Response) {
		const avatar = await this.friendshipService.getUserAvatar(parseInt(id), res);
		return avatar;
	}
}
