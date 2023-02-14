import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) { }

	@Get('/profile')
	@UseGuards(JwtGuard)
	async getMe(@GetUser() user: User) {
		// return `Welcome ${req.user.username}!`;

		return await this.userService.fetchProfileData(user.username);
	}
}
