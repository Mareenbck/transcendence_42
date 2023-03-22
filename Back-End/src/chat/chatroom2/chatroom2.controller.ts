import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { Chatroom2Service } from './chatroom2.service';
import { CreateChatroom2Dto, CreateRoomDto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';
import {
	HttpCode,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';

@Controller('chatroom2')
export class Chatroom2Controller {
  constructor(private readonly chatroom2Service: Chatroom2Service) {}

  @Post('/create_channel')
  async create(@Body()createRoomDto2Dto: CreateRoomDto) {
    const newChannel = await this.chatroom2Service.create(createRoomDto2Dto);
    return newChannel;
  }

  @Get()
  findAll() {
    return this.chatroom2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatroom2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatroom2Dto: UpdateChatroom2Dto) {
    return this.chatroom2Service.update(+id, updateChatroom2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroom2Service.remove(+id);
  }
}
