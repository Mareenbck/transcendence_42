import { Controller, Get, Post, Body, Param, UseGuards, } from '@nestjs/common';
import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { ChatMessService } from './chat-mess.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtGuard} from 'src/auth/guard';

@Controller('chat-mess')
export class ChatMessController {
  constructor(private chatMessService: ChatMessService) {}

  @Get()
    @UseGuards(JwtGuard)
    async findAll(): Promise<CreateChatMessDto[]> {
    return this.chatMessService.findAll();
  }

  @Post()
    @UseGuards(JwtGuard)
    async createM( @Body() {authorId, content, chatroomId, }): Promise<CreateChatMessDto> {
    const msg = await this.chatMessService.create({authorId, content, chatroomId, });
    return msg;
  }

  @Get('/room/:chatroomId')
    @UseGuards(JwtGuard)
    async findRoom(@Param('chatroomId') chatroomId: number) {
      if (chatroomId === undefined || isNaN(chatroomId) ) {
        throw new BadRequestException('Undefined room ID');
      }
      const msg = await this.chatMessService.findRoom(chatroomId);
      return msg;
    };
  }


