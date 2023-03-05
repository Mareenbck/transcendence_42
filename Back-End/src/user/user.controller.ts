import { Body, Controller, ForbiddenException, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { FortyTwoAuthGuard, JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../decorators/get-userId.decorator';
import { GetUser } from 'src/auth/decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) { }

	@Get('/profile/:id')
	@UseGuards(JwtGuard)
	async getMe(@GetCurrentUserId() id: string) {
		const userDto = this.userService.getUser(parseInt(id));
		return userDto;
	}

	@Post('/:id/username')
	// @UseGuards(JwtGuard)
	async updateUsername(@GetCurrentUserId() id: string, @Body('username') username: string) {
		try {
		const result = await this.userService.updateUsername(id, username);
			return result;
		} catch {
			throw new ForbiddenException('Username already exists');
		}
	}
}

