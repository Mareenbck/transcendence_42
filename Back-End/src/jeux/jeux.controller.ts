import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJeuDto } from './dto/create-jeu.dto';
import { UpdateJeuDto } from './dto/update-jeu.dto';
import { BadRequestException,Injectable } from '@nestjs/common';

@Controller('jeux')
export class JeuxController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
    async findAll(): Promise<CreateJeuDto[]> {
    return this.prismaService.jeu.findMany();
  }

  @Post()
  async create(@Body() createJeuDto: CreateJeuDto) {
    const msg = await this.prismaService.jeu.create({data: createJeuDto});
    return msg;
  }
}


