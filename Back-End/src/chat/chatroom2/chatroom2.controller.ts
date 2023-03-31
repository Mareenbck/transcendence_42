import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { ChatroomService } from './chatroom2.service';
import { CreateChatroomDto } from './dto/create-chatroom2.dto';
import { UpdateChatroomDto } from './dto/update-chatroom2.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtGuard} from 'src/auth/guard';

@Controller('chatroom2')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create( @Body() {name, avatar }): Promise<CreateChatroomDto> {
    const msg = await this.chatroomService.create({name, avatar});
    return msg;
  }

  @Get()
  @UseGuards(JwtGuard)
  async findAll(): Promise<CreateChatroomDto[]> {
    return this.chatroomService.findAll();
  };
}

