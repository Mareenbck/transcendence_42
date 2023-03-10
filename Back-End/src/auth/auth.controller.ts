import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { GetUser } from './decorator';
import { AuthDto } from './dto/auth.dto';
import { SigninDto } from './dto/signin.dto';
import { Response } from 'express';
import { TwoFaUserDto } from './dto/2fa.dto';
import { FortyTwoAuthGuard } from './guard/42auth.guard';
import { TwoFactorAuthService } from './2FA/2FactorAuth.service';
import { FortyTwoStrategy, Profile_42 } from './strategy/42.strategy';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService,
				private twoFAService: TwoFactorAuthService,
			private fortyTwoStrategy: FortyTwoStrategy) {}

	@Post('/signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	@UseGuards(LocalAuthGuard)
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

	@Get('42')
	// @UseGuards(FortyTwoAuthGuard)
	async login42() {
		const url = await this.fortyTwoStrategy.getIntraUrl();
		return { url };
	}

	@Post('42/callback')
	// @UseGuards(FortyTwoAuthGuard)
	async callback_42(@Req() request: any, @Res() response: Response) {
		const code = request.body.code;
		try {
			// Echange le code d'autorisation contre un token
			const tokens = await this.authService.exchangeCodeForTokens(code);
			// Get user profile using the access token
			const userProfile = await this.authService.getFortyTwoUserProfile(tokens.access_token);
			// Generate token using user profile
			const user = await this.authService.signin_42(userProfile);
			const newtokens = await this.authService.generateTokens(user.id, user.email, user.twoFA);
			await this.authService.updateRefreshToken(user.id, newtokens.refresh_token);
			return response.status(HttpStatus.OK).send({ newtokens, user });
		} catch(error) {
			console.log(error);
		}
	}
}
