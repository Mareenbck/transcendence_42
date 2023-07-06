import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthService } from './2FactorAuth.service';
import { Response } from 'express';
import { GetUser } from '../decorator/get-user.decorator';
import { TwoFactorDto, TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { JwtGuard } from '../guard';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth/2fa')
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthService: TwoFactorAuthService,
		private userService: UserService,
	) { }

	@Get('')
	@UseGuards(JwtGuard)
	async get2FA(@GetUser() user: TwoFactorDto) {
		const is2FA = await this.twoFactorAuthService.getIs2FA(user);
		return is2FA;
	}

	@Post('/generate')
	@UseGuards(JwtGuard)
	async register(@Res() response: Response, @GetUser('email') email: string,) {
		const { otpauthUrl } = await this.twoFactorAuthService.generate2FAsecret(email);
		const qrcode = await this.twoFactorAuthService.generate2FAQRCode(otpauthUrl);
		return response.json(qrcode);
	}

	@Post('/turn-on')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async turnOn(@GetUser() user: TwoFactorDto) {
		const userFound = await this.userService.turnOn2FA(user.email)
		return userFound;
	}

	@Post('/turn-off')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async turn_off(@GetUser() user: TwoFactorDto) {
		const userFound = await this.userService.turnOff2FA(user.email)
		return userFound;
	}

	@Post('/authenticate')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async authenticate(@Body() { twoFAcode }: any, @GetUser() user: TwoFactorDto) {
		try {
			const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
				twoFAcode,
				user
				);
			if (isCodeValid) {
				return this.twoFactorAuthService.loginWith2fa(user);
			} else {
				return false
			}
		} catch {
			console.error("Error in isTwoFactorAuthenticationCodeValid: ");
			return false;
		}
	}
}

