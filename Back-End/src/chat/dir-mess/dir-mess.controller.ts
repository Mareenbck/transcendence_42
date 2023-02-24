import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DirMessService } from './dir-mess.service';
import { DirMessDto } from './dir-mess.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('dirMess')
export class DirMessController {
  constructor(private readonly dirMessService: DirMessService) {}

  @Get()
    async getDirMess() {
    return this.dirMessService.getDirMess();
  }

  @Post()
    async postDirMess(@Body() dirMess: DirMessDto) {
    return this.dirMessService.postDirMess(dirMess);
  }

 @Get(':Id')
    async getDirMessById(@Param('id') id:number) {
    return this.dirMessService.getDirMessById(id);
  }
}
