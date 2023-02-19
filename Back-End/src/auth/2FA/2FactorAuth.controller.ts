
import {
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthService } from './2FactorAuth.service';
import { Response } from 'express';
import { GetUser } from '../decorator/get-user.decorator';
import { TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { JwtGuard } from '../guard';

@Controller('/auth/2fa')
// @UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthService: TwoFactorAuthService,
	) { }

	@Post('/generate')
	@UseGuards(JwtGuard)
	async register(@Res() response: Response, @GetUser() user: TwoFaUserDto) {
		const { otpauthUrl } = await this.twoFactorAuthService.generate2FAsecret(user);
		const qrcode = await this.twoFactorAuthService.generate2FAQRCode(otpauthUrl);
		return response.json(qrcode);
	}

	@Post('/turn-on')
	@HttpCode(200)
	async turnOn(@Body() { twoFAcode }: any, @GetUser() user: TwoFaUserDto) {
		const tokens = await this.twoFactorAuthService.turn_on(twoFAcode, user);
		return tokens;
	}
}
