import { Controller, Get, Post, Body, Param } from '@nestjs/common';
//import { DirMessService } from './dir-mess.service';
import { DirMessDto } from './dir-mess.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';


@Controller('dir-mess')
export class DirMessController {
  constructor(private readonly prismaService: PrismaService) {}


  @Get()
    async findAll(): Promise<DirMessDto[]> {
    return this.prismaService.directMessage.findMany();
  }

  @Post()
    async create( @Body() {content, receiver, author}): Promise<DirMessDto> {
    console.log(content);
    const msg = await this.prismaService.directMessage.create({data: {content, receiver, author}});
    return msg;
  }

  @Get('/:me/:friend')
    async findDirMess(@Param('me') me: number, @Param('friend') friend:number) {
    if (me === undefined || isNaN(me) || friend === undefined || isNaN(me))
    {   throw new BadRequestException('Undefined user ID'); }
    return this.prismaService.directMessage.findMany({
      where: {
        OR: [
          { AND: [ {author: +me},
                   {receiver: +friend} ]
          },
          { AND: [ {author: +friend},
                   {receiver: +me} ]
          },
        ]
      }
    });
  }



/*
 @Get(':Id')
    async getDirMessById(@Param('id') id:number) {
    return this.dirMessService.getDirMessById(id);
  }

  @Get()
    async getDirMess() {
    return this.dirMessService.getDirMess();
  }
*/

}
