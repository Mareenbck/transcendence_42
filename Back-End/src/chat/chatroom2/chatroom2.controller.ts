import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatroom2Dto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Chatroom2Service } from './chatroom2.service';

@Controller('chatroom2')
export class Chatroom2Controller {
  constructor(private readonly prismaService: PrismaService, private chatRoomService: Chatroom2Service) {}

  @Post()
    async create( @Body() newConv: any): Promise<CreateChatroom2Dto> {
      const newChannel = await this.chatRoomService.create(newConv);
    
    return null
  }

  @Get()
    async findAll(): Promise<CreateChatroom2Dto[]> {
    return this.prismaService.chatroom.findMany();
  }

  // @Post(':id/delete')
  // async delete(@Param('id'): Promise<CreateChatroom2Dto[]> {
  //   return await this.prismaService.chatroom.deleteChatroom(id);
  // }
}

