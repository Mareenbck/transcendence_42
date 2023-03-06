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
import { AuthGuard } from '../guard/auth.guard';

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
	@UseGuards(AuthGuard)
	async turnOn(@GetUser() user: TwoFactorDto) {
		// const user: TwoFactorDto = request.user as TwoFactorDto;
		// Check is 2FA code is valid
		const u = await this.userService.turnOn2FA(user.email)
		console.log("user dans onnnnnnnnnnnnnn")
		console.log(u)
		// const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
		// 	twoFAcode,
		// 	user
		// );
		// // If invalid, throw error 401
		// if (!isCodeValid) {
		// 	throw new UnauthorizedException('Wrong authentication code');
		// }
		// const u = await this.userService.turnOn2FA(user.email);
		// console.log("user dans onnnnnnn")
		// console.log(u)
		// const tokens = await this.twoFactorAuthService.turn_on(user);
		return u;
	}

	@Post('/turn-off')
	@HttpCode(200)
	@UseGuards(AuthGuard)
	async turn_off(@GetUser() user: TwoFactorDto) {
		const u = await this.userService.turnOff2FA(user.email)
		console.log("user dans offffffffff")
		console.log(u)
		return u;
	}

	@Post('/authenticate')
	@HttpCode(200)
	@UseGuards(AuthGuard)
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

