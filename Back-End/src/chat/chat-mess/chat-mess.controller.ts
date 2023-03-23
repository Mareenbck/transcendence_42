import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateChatMessDto } from './dto/create-chatMess.dto';
import { UpdateChatMessDto } from './dto/update-chatMess.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Controller('chat-mess')
export class ChatMessController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
    async findAll(): Promise<CreateChatMessDto[]> {
    return this.prismaService.chatroomMessage.findMany();
  }

  @Post()
    async create( @Body() {authorId, content, chatroomId, }): Promise<CreateChatMessDto> {
    const msg = await this.prismaService.chatroomMessage.create({data: {authorId, content, chatroomId,}});
    return msg;
  }


  @Get('/room/:chatroomId')
    async findRoom(@Param('chatroomId') chatroomId: number) {
    if (chatroomId === undefined || isNaN(chatroomId) ) {
      throw new BadRequestException('Undefined room ID');
    }
    return this.prismaService.chatroomMessage.findMany({
      where: {chatroomId: +chatroomId},
    });
  }

}


