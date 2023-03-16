import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { BadRequestException,Injectable } from '@nestjs/common';

@Controller('games')
export class GamesController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
    async findAll(): Promise<CreateGameDto[]> {
    return this.prismaService.game.findMany();
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const msg = await this.prismaService.game.create({data: createGameDto});
    return msg;
  }
}


