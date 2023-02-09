import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from "./auth.service";
import { GetUser } from './decorator';
import { AuthDto } from './dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}

	@Get('test')
	@UseGuards(AuthGuard)
	test(@GetUser() user: User) {
		return 'Hey ' + user.username;
	}

}
