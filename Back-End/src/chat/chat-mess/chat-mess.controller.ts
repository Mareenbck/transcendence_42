import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatroomMessDto } from './chat-mess.dto';
import { PrismaService } from '../../prisma/prisma.service';


@Controller('chat-mess')
export class ChatMessController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
    async findAll(): Promise<ChatroomMessDto[]> {
    return this.prismaService.chatroomMessage.findMany();
  }

  @Post()
    async create( @Body() {content, chatroomId, author, createdAt}: ChatroomMessDto): Promise<ChatroomMessDto> {
    return this.prismaService.chatroomMessage.create({data: {content, chatroomId, author, createdAt}});
  }

}
