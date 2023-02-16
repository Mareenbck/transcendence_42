import { BadRequestException, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto, AuthTokenDto } from "./dto";
import * as argon from 'argon2';
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { SigninDto } from "./dto/signin.dto";
import { Response } from 'express';
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService, private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signup(dto: AuthDto): Promise<AuthTokenDto> {
		// destructure dto
		const { email, username, password } = dto;
		//generate the password
		const hash = await argon.hash(password);
		//save new user in the db
		try {
			const user = await this.userService.createUser(
				email,
				username,
				hash,
			);
			// return a hashed user
			const tokens = await this.generateTokens(user.id, user.email);
			await this.updateRefreshToken(user.id, tokens.refresh_token);
			// await this.uploadService.download_avatar(
			// 	user.id,
			// 	process.env.DEFAULT_AVATAR,
			// );
			return tokens;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}

	async signin(dto: SigninDto) {
		//find the user by email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		//if user doesnt exist -> throw exception
		if (!user)
			throw new ForbiddenException('Credentials incorrect');
		//compare password
		const pwMatches = await argon.verify(user.hash, dto.password);
		//if password incorect -> throw exception
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');
		const tokens = await this.generateTokens(user.id, user.email);
		// update refresh token
		await this.updateRefreshToken(user.id, tokens.refresh_token);
		console.log("SERVICE " + tokens);
		console.log("AUTH SERVICE  " + user.email);
		return tokens;
		// return user;
	}

	/* SIGNOUT */
	async signout(userId: number): Promise<void> {
		// delete refresh token (log out)
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRtoken: {
					// eslint-disable-next-line unicorn/no-null
					not: null,
				},
			},
			data: {
				// eslint-disable-next-line unicorn/no-null
				hashedRtoken: null,
			},
		});
		//sending status update to the front
		// this.appGateway.offlineFromService(userId);
	}

	/* GENERATE JSON WEB TOKENS */
	async generateTokens(userId: number, email: string): Promise<AuthTokenDto> {
		const data = {
			sub: userId,
			email,
		};
		const secret = process.env.JWT_SECRET;
		// Set expiration times
		const access_token_expiration = process.env.ACCESS_TOKEN_EXPIRATION;
		const refresh_token_expiration = process.env.REFRESH_TOKEN_EXPIRATION;
		// const secret = this.config.get('JWT_SECRET');
		const Atoken = await this.jwt.signAsync(data, {
			expiresIn: access_token_expiration,
			secret: secret,
		});
		const Rtoken = await this.jwt.signAsync(data, {
			expiresIn: refresh_token_expiration,
			secret: secret,
		});
		console.log('Atoken : ' + Atoken);
		console.log('Rtoken : ' + Rtoken);
		return {
			access_token: Atoken,
			refresh_token: Rtoken,
		};
	}

	/* REFRESH TOKEN */
	async refresh_token(userId: number, refreshToken: string): Promise<AuthTokenDto> {
		// Find user by id
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		// Check if user exists and is logged in
		if (!user || !user.hashedRtoken)
			// throw 403 error
			throw new ForbiddenException('Invalid Credentials');
		// Verify hashed Refresh Token
		const pwMatches = await argon.verify(user.hashedRtoken, refreshToken);
		// Invalid refresh token
		if (!pwMatches)
			// throw 403 error
			throw new ForbiddenException('Invalid Credentials');
		// Generate new tokens
		const tokens = await this.generateTokens(user.id, user.email);
		// Update Refresh Token - if user is logged in and valid
		await this.updateRefreshToken(user.id, tokens.refresh_token);
		// return tokens
		return tokens;
	}

	/* UPDATE REFRESH TOKEN */
	async updateRefreshToken(
		userId: number,
		refreshToken: string,
	): Promise<void> {
		// hash refresh token
		const hash = await argon.hash(refreshToken);
		// update user refresh token (log in)
		await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				hashedRtoken: hash,
			},
		});
	}

	async verifyAccessToken(token: string): Promise<User> {
		try {
			const decoded = this.jwt.verify(token);
			if (!decoded.type || !decoded.user || decoded.type !== 'access') {
				throw new BadRequestException('Invalid access token');
			}
			return await this.prisma.user.findUnique({
				where: {
					id: decoded.user.id,
				},
			});
		} catch (e) {
			throw new BadRequestException('Invalid access token');
		}
	}



}
