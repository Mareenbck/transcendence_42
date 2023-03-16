/*

import { Controller, Delete, Get, Post, Body, Param } from '@nestjs/common';
import { ChatroomDto } from './chatroom.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
    async findAll(): Promise<ChatroomDto[]> {
    return this.prismaService.chatroom.findMany();
  }

  @Post()
    async create( @Body() {name, avatar}: ChatroomDto): Promise<ChatroomDto> {
    return this.prismaService.chatroom.create({data: {name, avatar}});
  }


}

*/
