import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { ConfigService } from "@nestjs/config";
import { UserService } from 'src/user/user.service';
import { TwoFactorDto, TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { Response } from 'express';
import { Body, Controller, Get, HttpCode, HttpStatus, BadRequestException, Post, Req, Res, UseGuards } from '@nestjs/common';


@Injectable()
export class TwoFactorAuthService {
	constructor(
		private authservice: AuthService,
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private prisma: PrismaService
	) {}

	async generate2FAsecret(email: string) {
		// Generate a 2FA secret
		const secret = authenticator.generateSecret();
		// Create a URL for the QR code
		const otpauthUrl = authenticator.keyuri(
			email,
			this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
			secret,
		);
		// Add the secret to the user
		await this.userService.set2FASecretToUser(secret, email);
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

	// Check is 2FA code is valid
	public isTwoFactorAuthenticationCodeValid(twoFAcode: string, user: TwoFactorDto) {
		if (!twoFAcode || !user.twoFAsecret) {
			throw new BadRequestException('Missing authentication code or user secret');
		  }
		  try {
			const isValid = authenticator.verify({
			  token: twoFAcode,
			  secret: user.twoFAsecret
			});
			return isValid;
		  } catch (error) {
			return false;
		  }
	}

	/* Turn on 2FA for existing user */
	async turn_on(user: TwoFaUserDto) {
		// Enable 2FA for user
		await this.userService.turnOn2FA(user.email);
		const tokens = await this.authservice.generateTokens(user.id, user.email, true);
		return tokens;
	}

	/* Authenticate signin using 2FA */
	async loginWith2fa(dto: TwoFactorDto) {
		// find user by email
		const user =  await this.userService.getByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException('Invalid User');
		}
		// generate tokens
		const tokens = await this.authservice.generateTokens(dto.id, dto.email, true);
		await this.authservice.updateRefreshToken(dto.id, tokens.refresh_token);
		return tokens;
	}

	async getIs2FA (dto: TwoFactorDto) {
		const user = await this.userService.getByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException('Invalid User');
		}
		return user.twoFA
	}
}
