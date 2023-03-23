import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { UpdateChatMessDto } from './dto/update-chatMess.dto';
import { ChatMessService } from './chat-mess.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Controller('chat-mess')
export class ChatMessController {
  constructor(private chatMessService: ChatMessService) {}

  @Get()
    async findAll(): Promise<CreateChatMessDto[]> {
    return this.chatMessService.findAll();
  }

  @Post()
    async createM( @Body() {authorId, content, chatroomId, }): Promise<CreateChatMessDto> {
    const msg = await this.chatMessService.create({authorId, content, chatroomId, });
    return msg;
  }

  @Get('/room/:chatroomId')
    async findRoom(@Param('chatroomId') chatroomId: number) {
      if (chatroomId === undefined || isNaN(chatroomId) ) {
        throw new BadRequestException('Undefined room ID');
      }
      const msg = await this.chatMessService.findRoom(chatroomId);
      return msg;
    };
  }


