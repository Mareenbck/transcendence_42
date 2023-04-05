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
      console.log("CHANNEL ID")
      console.log(ids)
      const newUserTable = await this.chatRoomService.createUserTable(ids);
      console.log("NEW USER TABLE")
      console.log(newUserTable)
    return newUserTable;
    }

  @Get()
  @UseGuards(JwtGuard)
  async findAll(): Promise<CreateChatroomDto[]> {
    return this.chatRoomService.findAll();
  };
 
  // @Post(':id/delete')
  // async delete(@Param('id'): Promise<CreateChatroom2Dto[]> {
  //   return await this.prismaService.chatroom.deleteChatroom(id);
  // }

}

