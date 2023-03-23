import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DirMessService } from './dir-mess.service';
import { DirMessDto } from './dir-mess.dto';
import { BadRequestException, Injectable } from '@nestjs/common';


@Controller('dir-mess')
export class DirMessController {
  constructor(private dirMessService: DirMessService) {}


  @Get()
  async findAll(): Promise<DirMessDto[]> {
    return this.dirMessService.findAll();
  }

  @Post()
  async create( @Body() {content, receiver, author}): Promise<DirMessDto> {
    const msg = await this.dirMessService.create({content, receiver, author});
    return msg;
  }

  @Get('/:me/:friend')
  async findDirMess(@Param('me') me: number, @Param('friend') friend:number) {
    if (me === undefined || isNaN(me) || friend === undefined || isNaN(me))
    {   throw new BadRequestException('Undefined user ID'); }
    return this.dirMessService.findSome(me, friend);
   };
}


