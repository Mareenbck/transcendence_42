import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthService } from './2FactorAuth.service';
import { Response } from 'express';
import { GetUser } from '../decorator/get-user.decorator';
import { TwoFactorDto, TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { JwtGuard } from '../guard';
import { UserService } from 'src/user/user.service';

@Controller('auth/2fa')
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthService: TwoFactorAuthService,
		private userService: UserService,
	) { }

	@Post('/generate')
	@UseGuards(JwtGuard)
	async register(@Res() response: Response, @GetUser('email') email: string,) {
		const { otpauthUrl } = await this.twoFactorAuthService.generate2FAsecret(email);
		const qrcode = await this.twoFactorAuthService.generate2FAQRCode(otpauthUrl);
		return response.json(qrcode);
	}

	@Post('/turn-on')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async turnOn(@Body() { twoFAcode }: any, @GetUser() user: TwoFactorDto) {
		// Check is 2FA code is valid
		const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
			twoFAcode,
			user
		);
		// If invalid, throw error 401
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.userService.turnOn2FA(user.email);
		// const tokens = await this.twoFactorAuthService.turn_on(user);
		// return tokens;
	}

	@Post('/turn-off')
	@HttpCode(200)
	async turn_off(@GetUser() user: TwoFactorDto) {
		return await this.userService.turnOff2FA(user.email);;
	}

	@Post('/authenticate')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async authenticate(@Body() { twoFAcode }: any, @GetUser() user: TwoFactorDto) {
		const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
			twoFAcode,
			user
			);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		return this.twoFactorAuthService.loginWith2fa(user);
	}
}
