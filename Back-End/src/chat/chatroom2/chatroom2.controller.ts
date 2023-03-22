import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChatroom2Dto } from './dto/create-chatroom2.dto';
import { UpdateChatroom2Dto } from './dto/update-chatroom2.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Controller('chatroom2')
export class Chatroom2Controller {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
    async create( @Body() {name, avatar }): Promise<CreateChatroom2Dto> {
    const msg = await this.prismaService.chatroom.create({data: {name, avatar}});
    return msg;
  }

  @Get()
    async findAll(): Promise<CreateChatroom2Dto[]> {
    return this.prismaService.chatroom.findMany();
  }
}


