import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
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
	async create( @Body() newConv: any, @GetCurrentUserId() userId: string): Promise<CreateChatroomDto> {
		// console.log("newConv--->")
		// console.log(newConv)
		const newChannel = await this.chatRoomService.create(newConv, parseInt(userId));

    if (newChannel) {
			await this.userService.updateAchievement(parseInt(userId), 'Federator')
		}
		return newChannel;
	}

	@Post('join')
	// @UseGuards(JwtGuard)
	async createUserTable(@Body() { userId, channelId, hash }: { userId: number, channelId: number, hash?: string }) {
		const newUserTable = await this.chatRoomService.createUserTable({ userId, channelId }, hash);
		return newUserTable;
	}


  @Get()
  @UseGuards(JwtGuard)
  async findAll(): Promise<CreateChatroomDto[]> {
    return await this.chatRoomService.findAll();
  };

  @Get('userTable/:id/:channelId')
  async getUserTable(@Param('id') id: string, @Param('channelId') channelId:string) {
    const response = await this.chatRoomService.getUserTable(parseInt(id), parseInt(channelId));
    // console.log("channelId controller get", channelId)
    // console.log("response usertable");
    // console.log(response);
    return response;
  }

  // @Post('/:channelId/password')
  // // @UseGuards(JwtGuard)
  // async


  // @Post(':id/delete')
  // async delete(@Param('id'): Promise<CreateChatroom2Dto[]> {
  //   return await this.prismaService.chatroom.deleteChatroom(id);
  // }

	@Post('/ask_join')
	@UseGuards(JwtGuard)
	async openFriendship(@Body() id: any, @GetCurrentUserId() userId: string) {
		//creation d une demande d'acces dans database
		const { channelId } = id;
		const newDemand = await this.chatRoomService.openDemand(parseInt(userId), channelId);
		console.log("newDemand--->");
		console.log(newDemand);
		return newDemand;
	}

	@Post('/pending_demand')
	@UseGuards(JwtGuard)
	async getReceived(@GetCurrentUserId() userId: string){

		const demands = await this.chatRoomService.getReceivedDemands(parseInt(userId));
		console.log("received pending demands--->")
		console.log(demands)
		return demands;
	}

}

