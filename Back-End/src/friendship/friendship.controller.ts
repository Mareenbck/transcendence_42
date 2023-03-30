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
	async showFriends(@Body() userId: number){
		const friends = await this.friendshipService.showFriends(userId);
		return friends.friendOf
		//si status est validee => enregistre les amis de chacun dans la DB
		//return la liste des amis accepte du user
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
		try {
			const user = await this.userService.getUser(parseInt(id));
			// >>>> const avatar a mettre dans service
			if (user.avatar) {
				const fileName = path.basename(user.avatar)
				const result = res.sendFile(fileName, { root: process.env.UPLOAD_DIR });
				return result
			}
			else if (!user.ftAvatar && !user.avatar) {
				const fileName = process.env.DEFAULT_AVATAR;
				const result = res.sendFile(fileName, { root: process.env.PATH_DEFAULT_AVATAR });
				return result
			}
		} catch {
			throw new ForbiddenException('Not Found');
		}
	}
}
