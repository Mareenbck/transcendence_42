import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard, FortyTwoAuthGuard, JwtGuard, LocalAuthGuard } from 'src/auth/guard';
import { FriendshipService } from './friendship.service';
import { GetCurrentUserId } from '../decorators/get-userId.decorator';
import { FriendsDto } from './dto/friends.dto';
import { GetUser } from 'src/auth/decorator';

@Controller('friendship')
export class FriendshipController {
	constructor(private friendshipService: FriendshipService) { }

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
}
