import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatroomService } from './chatroom2.service';

import { JwtGuard} from 'src/auth/guard';
@Controller('chatroom2')
export class Chatroom2Controller {
  constructor(private chatRoomService: ChatroomService) {}

  @Post()
  @UseGuards(JwtGuard)
    async create( @Body() newConv: any): Promise<CreateChatroomDto> {
      const newChannel = await this.chatRoomService.create(newConv);
      console.log("NEW CHANNEL CONTROLLER")
      console.log(newChannel)
    return newChannel;
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

