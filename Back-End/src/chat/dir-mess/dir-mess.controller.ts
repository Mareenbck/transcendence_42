import { Controller, Get, Post, Body, Param, UseGuards} from '@nestjs/common';
import { DirMessService } from './dir-mess.service';
import { DirMessDto } from './dir-mess.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtGuard} from 'src/auth/guard';
import { GetCurrentUserId } from 'src/decorators/get-userId.decorator';

@Controller('dir-mess')
export class DirMessController {
  constructor(private dirMessService: DirMessService) {}


  @Get()
  @UseGuards(JwtGuard)
  async findAll(): Promise<DirMessDto[]> {
    return this.dirMessService.findAll();
  }

  @Post()
  @UseGuards(JwtGuard)
  async create( @Body() {content, receiver, author}): Promise<DirMessDto> {
    const msg = await this.dirMessService.create({content, receiver, author});
    return msg;
  }

  @Get('/:me/:friend')
  @UseGuards(JwtGuard)
  async findDirMess(@Param('me') me: number, @Param('friend') friend:number) {
    if (me === undefined || isNaN(me) || friend === undefined || isNaN(me))
    {   throw new BadRequestException('Undefined user ID'); }
    return this.dirMessService.findSome(me, friend);
   };

	@Get('/getMessages')
	@UseGuards(JwtGuard)
	async UserWithDirectMessages(@GetCurrentUserId() userId: string) {
		const latestmessage = await this.dirMessService.getLastestMessage(parseInt(userId))
		return latestmessage;
	};
}


