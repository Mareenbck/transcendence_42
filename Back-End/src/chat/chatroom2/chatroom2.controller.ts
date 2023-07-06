import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode} from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { ChatroomService } from './chatroom2.service';
import { JwtGuard} from 'src/auth/guard';
import { GetCurrentUserId } from 'src/decorators/get-userId.decorator';
import { UserService } from 'src/user/user.service';


@Controller('chatroom2/')
export class Chatroom2Controller {
  constructor(private chatRoomService: ChatroomService,
				private readonly userService: UserService) {}

	@Post()
	@UseGuards(JwtGuard)
	async create( @Body() newConv: any, @GetCurrentUserId() userId: string): Promise<number> {
		const newChannel = await this.chatRoomService.create(newConv, parseInt(userId));
		if (newChannel) {
			await this.userService.updateAchievement(parseInt(userId), 'Federator')
		}
		return newChannel.id;
	}

	@Post('join')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async createUserTable(@Body() { userId, channelId, hash }: { userId: number, channelId: number, hash?: string }) {
		try {
			const newUserTable = await this.chatRoomService.createUserTable({ userId, channelId }, hash);
			return newUserTable;
		} catch (err) {
			console.log('wrong password')
			return false
		}
	}

	@Post('/:channelId/delete')
	async delete(@Param('channelId') channelId: string) {
		const response = await this.chatRoomService.delete(parseInt(channelId));
		return response;
	}

  @Get()
  @UseGuards(JwtGuard)
  async findAll(): Promise<CreateChatroomDto[]> {
    return await this.chatRoomService.findAll();
  };

  @Get('userTable/:id/:channelId')
  async getUserTable(@Param('id') id: string, @Param('channelId') channelId:string) {
    const response = await this.chatRoomService.getUserTable(parseInt(id), parseInt(channelId));
    return response;
  };

  @Get(':channelId/participants')
  @UseGuards(JwtGuard)
  async getParticipants(@Param('channelId') channelId: string) {
	const participants = await this.chatRoomService.getParticipants(parseInt(channelId));
    return participants;
  }

	@Post(':channelId/admin/:userId')
	@UseGuards(JwtGuard)
	async addAdmin(@Param('channelId') channelId: string, @Param('userId') userId: string) {
		const response = await this.chatRoomService.addAdmin(parseInt(channelId), parseInt(userId));
		return response;
	}


	@Post('/invite_channel')
	@UseGuards(JwtGuard)
	async openFriendship(@Body() ids: any, @GetCurrentUserId() userId: string) {
		const { channelId, invitedId } = ids;
		const newDemand = await this.chatRoomService.openInvitations(parseInt(userId), channelId, invitedId);
		return newDemand;
	}

	@Get('/pending_invitations')
	@UseGuards(JwtGuard)
	async getReceived(@GetCurrentUserId() userId: string){
		const demands = await this.chatRoomService.getReceivedInvitations(parseInt(userId));
		return demands;
	}

	@Post('/invit_update')
	@UseGuards(JwtGuard)
	async updateDemand(@Body() invitation: any) {
		const result = await this.chatRoomService.updateInvitation(invitation);
		if (result.status === 'ACCEPTED') {
			await this.chatRoomService.addChatroom(result);
		}
		else if (result.status === 'REJECTED') {
			await this.chatRoomService.deleteRefusedInvitations();
		}
		return result;
	}

	@Post('/leave_channel')
	@UseGuards(JwtGuard)
	async leaveChannel(@Body() chatroomId: number, @GetCurrentUserId() userId: string) {
		const channel = await this.chatRoomService.removeUserFromChannel(parseInt(userId), chatroomId);
		return channel;
	}

	@Post('/:channelId/newpassword')
	@UseGuards(JwtGuard)
	async changePassword(@Param('channelId') channelId: string, @Body() hash:any) {
		const newPassword = await this.chatRoomService.updatePassword(parseInt(channelId), hash);
		return newPassword;
	}

	@Post('/:channelId/kick/:userId')
	@UseGuards(JwtGuard)
	async kick(@Param('channelId') channelId: string, @Param('userId') userId: string) {
		const kickSomeone = await this.chatRoomService.kick(parseInt(channelId), parseInt(userId));
		return kickSomeone;
	}

	@Post('/:channelId/ban/:userId')
	@UseGuards(JwtGuard)
	async ban(@Param('channelId') channelId: string, @Param('userId') userId: string) {
		const banSomeone = await this.chatRoomService.ban(parseInt(channelId), parseInt(userId));
		const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
		return banSomeone;
	}

	@Post('/:channelId/unban/:userId')
	@UseGuards(JwtGuard)
	async unBan(@Param('channelId') channelId: string, @Param('userId') userId: string) {
		const unBanSomeone = await this.chatRoomService.unBan(parseInt(channelId), parseInt(userId));
		const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));

		return unBanSomeone;
	}

	@Post('/:channelId/mute/:userId')
	@UseGuards(JwtGuard)
	async mute(@Param('channelId') channelId: string, @Param('userId') userId: string) {
		const muted = await this.chatRoomService.mute(parseInt(channelId), parseInt(userId));
		const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
		return allUser ;
	}

	@Post('/:channelId/unmute/:userId')
	@UseGuards(JwtGuard)
	async unmute(@Param('channelId') channelId: string, @Param('userId') userId: string) {
		const unmuted = await this.chatRoomService.unmute(parseInt(channelId), parseInt(userId));
		const allUser = await this.chatRoomService.getParticipants(parseInt(channelId));
		return allUser ;
	}



}

