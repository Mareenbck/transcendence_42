import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../decorators/get-userId.decorator';

@Controller('users')
export class UserController {
	constructor(private userService: UserService) { }

	@Get('/profile')
	@UseGuards(JwtGuard)
	async getMe(@GetCurrentUserId() id: number) {
		const userDto = this.userService.getUser(id);
		return userDto;
	}
}

