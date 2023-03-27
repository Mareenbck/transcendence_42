import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { ChatroomService } from './chatroom2.service';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { UpdateChatroomDto } from './dto/update-chatroom2.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Controller('chatroom2')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Post()
  async create( @Body() {name, avatar }): Promise<CreateChatroomDto> {
    const msg = await this.chatroomService.create({name, avatar});
    return msg;
  }

  @Get()
  async findAll(): Promise<CreateChatroomDto[]> {
    return this.chatroomService.findAll();
  };
}

