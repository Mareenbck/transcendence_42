import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream, toDataURL } from 'qrcode';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { ConfigService } from "@nestjs/config";
import { UserService } from 'src/user/user.service';
import { TwoFaUserDto } from 'src/auth/dto/2fa.dto';


@Injectable()
export class TwoFactorAuthService {
	constructor(
		private prisma: PrismaService,
		// private authservice: AuthService,
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) { }

	async generate2FAsecret(user: TwoFaUserDto) {
		// Generate a 2FA secret
		const secret = authenticator.generateSecret();
		// Create a URL for the QR code
		const otpauthUrl = authenticator.keyuri(
			user.email,
			this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
			secret,
		);
		// Add the secret to the user
		await this.userService.set2FASecretToUser(secret, user.email);
		return {
			secret,
			otpauthUrl,
		};
	}

	/* Generate a QR code for the user */
	async generate2FAQRCode(otpauthUrl: string) {
		// Generate a QR code from the URL
		return toDataURL(otpauthUrl);
	}

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: TwoFaUserDto) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: user.twoFAsecret
		})
	}
}
