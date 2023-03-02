import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { Chatroom2Service } from './chatroom2.service';
import { CreateChatroom2Dto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';

@Controller('chatroom2')
export class Chatroom2Controller {
  constructor(private readonly chatroom2Service: Chatroom2Service) {}

  @Post()
  create(@Body() createChatroom2Dto: CreateChatroom2Dto) {
    return this.chatroom2Service.create(createChatroom2Dto);
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
