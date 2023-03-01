import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { GetUser } from './decorator';
import { AuthDto } from './dto/auth.dto';
import { SigninDto } from './dto/signin.dto';
import { NextFunction, Response } from 'express';
import { TwoFaUserDto } from './dto/2fa.dto';
import { FortyTwoAuthGuard } from './guard/42auth.guard';
import passport from 'passport';
import { TwoFactorAuthService } from './2FA/2FactorAuth.service';
import { Profile_42 } from './strategy/FortyTwoStrategy';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private twoFAService: TwoFactorAuthService) {}

	@Post('/signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('/signin')
	async signin(@Body() dto: SigninDto, @Res({ passthrough: true }) response: Response) {
		const tokens = await this.authService.signin(dto);
		return tokens;
	}

	@Post('logout')
	@HttpCode(200)
	logout(@GetUser() user: TwoFaUserDto) {
		return this.authService.signout(user.id);
	}

	@Get('/42')
	@UseGuards(FortyTwoAuthGuard)
	async login42(): Promise<void> {
	}

	// @UseGuards(FortyTwoAuthGuard)
	@Post('/42/callback')
	async callback_42(@Req() request: any, @Res() response: Response) {
		const code = request.body.code;
		try {
			// Echange le code d'autorisation contre un jeton d'accès
			const tokens = await this.authService.exchangeCodeForTokens(code);
			// Get user profile using the access token
			const userProfile = await this.authService.getFortyTwoUserProfile(tokens.access_token);
			// Generate token using user profile and add to response
			const user = await this.authService.signin_42(userProfile);

			// return tokens;
			return response.status(HttpStatus.OK).send({ tokens, user });
		} catch(error) {
			console.log(error);
		}
	}


	// response.redirect(`http://localhost:8080/auth/42/callback`);

	// response.json({ token: token });

	// const tokens = await this.authService.signin_42(request.id);
	// return this.authService.signin_42_token(response, request.id, request.email);

	// @Get('42/callback')
	// @UseGuards(AuthGuard('42'))
	// async fortyTwoLoginCallback(@Req() request: any, @Res() res: Response) {
	// 	const token = await this.authService.login(user);
	// 	res.redirect(`${process.env.FRONTEND_URL}/auth/login?token=${token}`);
	// }

	// @Public()
	// @UseFilters(RedirectOnLogin)
	// @UseGuards(FortyTwoAuthGuard)
	// @Get('42/callback')
	// async callback_42(@Req() request: any, @Res() response: Response) {
	// 	// Generate token using API response
	// 	const user = await this.authService.signin_42(
	// 		request.user as Profile_42,
	// 	);
	// 	const { username, twoFA, id, email } = user;
	// 	// LOG
	// 	this.logger.log('42 API signin ' + username);
	// 	return twoFA
	// 		? this.twoFAService.signin_2FA(response, username)
	// 		: this.authService.signin_42_token(response, id, email);
	// }


	// @Get('test')
	// @UseGuards(AuthGuard)
	// test(@GetUser() user: User) {
	// 	return 'Hey ' + user.username;
	// }

}
