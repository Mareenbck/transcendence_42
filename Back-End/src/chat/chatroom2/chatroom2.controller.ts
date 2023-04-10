import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { ChatroomService } from './chatroom2.service';

import { JwtGuard} from 'src/auth/guard';
import { GetCurrentUserId } from 'src/decorators/get-userId.decorator';
@Controller('chatroom2/')
export class Chatroom2Controller {
  constructor(private chatRoomService: ChatroomService) {}

  @Post()
  @UseGuards(JwtGuard)
    async create( @Body() newConv: any, @GetCurrentUserId() userId: string): Promise<CreateChatroomDto> {
      const newChannel = await this.chatRoomService.create(newConv, parseInt(userId));
    return newChannel;
  }

  @Post('join')
  // @UseGuards(JwtGuard)
    async createUserTable( @Body() ids: any) {
      const newUserTable = await this.chatRoomService.createUserTable(ids);
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
    console.log("response usertable");
    console.log(response);
    return response;
  }
  

  // @Post(':id/delete')
  // async delete(@Param('id'): Promise<CreateChatroom2Dto[]> {
  //   return await this.prismaService.chatroom.deleteChatroom(id);
  // }

}

