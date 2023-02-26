import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatroomMessageDto } from './chatroomMessage.dto';
import { PrismaService } from '../../prisma/prisma.service';


@Controller('chat-mess')
export class ChatMessController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
    async findAll(): Promise<ChatroomMessageDto[]> {
    return this.prismaService.chatroomMessage.findMany();
  }

  @Post()
    async create( @Body() {content, chatroomId, authorId, createdAt}: ChatroomMessageDto): Promise<ChatroomMessageDto> {
    return this.prismaService.chatroomMessage.create({data: {content, chatroomId, authorId, createdAt}});
  }

}
