import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from "./auth.service";
import { GetUser } from './decorator';
import { AuthDto } from './dto/auth.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './guard/auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	async signin(@Body() dto: SigninDto, @Res({ passthrough: true }) response: Response) {
		const token = await this.authService.signin(dto);
		response.cookie('access_token', token, { httpOnly: true });
		console.log(response);
		return { message: 'Logged in successfully' };
	}

	@Get('test')
	@UseGuards(AuthGuard)
	test(@GetUser() user: User) {
		return 'Hey ' + user.username;
	}

}
