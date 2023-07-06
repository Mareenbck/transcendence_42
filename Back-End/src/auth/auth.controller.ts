import { Body, Controller, Get, HttpCode, HttpStatus, BadRequestException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { GetUser } from './decorator';
import { AuthDto, AuthTokenDto } from './dto/auth.dto';
import { SigninDto } from './dto/signin.dto';
import { Response } from 'express';
import { TwoFaUserDto } from './dto/2fa.dto';
import { TwoFactorAuthService } from './2FA/2FactorAuth.service';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtGuard } from './guard';


@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService,
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
		await this.authService.updateStatus(tokens);
		return tokens;
	}

	@Post('/logout')
	@UseGuards(JwtGuard)
	@HttpCode(200)
	async logout(@GetUser() user: TwoFaUserDto) {
		const delogUser = await this.authService.signout(user);
		console.log("delogUser =>", delogUser)
		return delogUser;
	}

	@Get('42')
	async login42() {
		const url = await this.fortyTwoStrategy.getIntraUrl();
		return { url };
	}

	@Post('42/callback')
	async callback_42(@Req() request: any, @Res() response: Response) {
		const code = request.body.code;
		try {
			const tokens = await this.authService.exchangeCodeForTokens(code);
			if (!tokens.access_token) {
				return ;
			}
			const userProfile = await this.authService.getFortyTwoUserProfile(tokens.access_token);
			const user = await this.authService.signin_42(userProfile);
			const newtokens = await this.authService.generateTokens(user.id, user.email, user.twoFA);
			await this.authService.updateRefreshToken(user.id, newtokens.refresh_token);
			await this.authService.updateStatus(newtokens);
			return response.status(HttpStatus.OK).send({ newtokens, user });
		} catch(error) {
			console.log(error);
		}
	}

	@Post('refresh')
	@HttpCode(200)
	async refresh(@Body() authTokenDto: AuthTokenDto) {
		try {
			const refreshToken = authTokenDto.refresh_token;
			if (!refreshToken) {
				throw new BadRequestException('No refresh token provided');
			}
			return await this.authService.refresh_token(refreshToken);
		} catch {
			console.error("refresh ");
			return false;
		}
	}


}
