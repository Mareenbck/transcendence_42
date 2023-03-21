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

	@Get('friends')
	async validateFriendship(){
		//si status est validee => enregistre les amis de chacun dans la DB
		//return la liste des amis accepte du user
	}

	@Post('update')
	async signDemand() {
		//actualise le status de la demande et enregistre dans la DB
		//return la firendship
	}

	@Post('delete')
	async deleteFriendship() {
		//si demande refusee supprime la firendship
		// si amis remove supprime la firenship
		//return friendship
	}


}
