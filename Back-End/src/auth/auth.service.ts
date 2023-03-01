import { BadRequestException, ExecutionContext, ForbiddenException, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Auth42Dto, AuthDto, AuthTokenDto } from "./dto";
import * as argon from 'argon2';
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { SigninDto } from "./dto/signin.dto";
import { Response } from 'express';
import { UserService } from "src/user/user.service";

export interface Profile_42 {
	id: number;
	username: string;
	email: string;
	avatar: string;
}


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
		//A DEPLACER DANS USER
		const user = await this.userService.getByEmail(dto.email)
		if (!user)
			throw new ForbiddenException('Credentials incorrect');
		//compare password
		const pwMatches = await argon.verify(user.hash, dto.password);
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');
		// si 2fa est true -> sort de cette method
		if (user.twoFA) {
			return { username: user.username, twoFA: user.twoFA };
		}
		const tokens = await this.generateTokens(user.id, user.email, user.twoFA);
		// update refresh token
		await this.updateRefreshToken(user.id, tokens.refresh_token);
		return tokens;
	}

	async signin_42(profile: Profile_42): Promise<User> {
		// DTO
		const { email, username, id } = profile;
		// check if user exists
		let user = await this.userService.getByEmail(email);

		if (!user) {
			this.create_42_user(profile);
		}
		console.log("user ========");
		console.log(user);

		return user;
	}

	generate_random_password(): string {
		// generate random password for 42 User
		const password =
			Math.random().toString(36).slice(2, 15) +
			Math.random().toString(36).slice(2, 15);
		return password;
	}

	async create_42_user(profile: Profile_42): Promise<User> {
		const { email, username, id } = profile;
		// generate random password
		const rdm_string = this.generate_random_password();
		// hash password using argon2
		const hash = await argon.hash(rdm_string);
		//create new user
		const user = await this.userService.createUser(
			email,
			username,
			hash,
			id,
		);
		return user;
	}

	async signout(userId: number): Promise<void> {
		// delete refresh token (log out)
		await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRtoken: { not: null },
			},
			data: {
				hashedRtoken: null,
			},
		});
		//sending status update to the front
		// this.appGateway.offlineFromService(userId);
	}

	async generateTokens(userId: number, email: string, is2FA = false): Promise<AuthTokenDto> {
		const data = {
			sub: userId,
			email,
			is2FA,
		};
		const secret = this.config.get('JWT_SECRET');
		const access_token_expiration = this.config.get('ACCESS_TOKEN_EXPIRATION');
		const refresh_token_expiration = this.config.get('REFRESH_TOKEN_EXPIRATION');
		const Atoken = await this.jwt.signAsync(data, {
			expiresIn: access_token_expiration,
			secret: secret,
		});
		const Rtoken = await this.jwt.signAsync(data, {
			expiresIn: refresh_token_expiration,
			secret: secret,
		});
		return {
			access_token: Atoken,
			refresh_token: Rtoken,
		};
	}

	async refresh_token(userId: number, refreshToken: string): Promise<AuthTokenDto> {
		// Find user by id
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		// Check if user exists and is logged in
		if (!user || !user.hashedRtoken)
			throw new ForbiddenException('Invalid Credentials');
		// Verify hashed Refresh Token
		const pwMatches = await argon.verify(user.hashedRtoken, refreshToken);
		if (!pwMatches)
			throw new ForbiddenException('Invalid Credentials');
		// Generate new tokens
		const tokens = await this.generateTokens(user.id, user.email);
		// Update Refresh Token - if user is logged in and valid
		await this.updateRefreshToken(user.id, tokens.refresh_token);
		return tokens;
	}

	async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
		// hash le refresh token
		const hash = await argon.hash(refreshToken);
		// update le user refresh token (log in)
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

	async exchangeCodeForTokens(code: string): Promise<{ access_token: string, refresh_token: string}> {
			const clientID = process.env.FORTYTWO_CLIENT_ID;
			const clientSecret = process.env.FORTYTWO_CLIENT_SECRET;
			const redirectURI = process.env.FORTYTWO_CALLBACK_URL;
			const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';

			const formData = new FormData();
			formData.append('grant_type', 'authorization_code');
			formData.append('client_id', clientID);
			formData.append('client_secret', clientSecret);
			formData.append('redirect_uri', redirectURI);
			formData.append('code', code);

			const response = await fetch(tokenEndpoint, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to exchange code for tokens');
			}

			const tokens = await response.json();
			console.log("tokens ===============")
			console.log(tokens)
			return {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token
			};
		}

		async getFortyTwoUserProfile(accessToken: string): Promise<Profile_42> {
			const headers = { Authorization: `Bearer ${accessToken}` };
			const url = 'https://api.intra.42.fr/v2/me';

			const response = await fetch(url, { headers });
			console.log("response ===========");
			console.log(response.ok);

			if (!response.ok) {
				throw new Error('Failed to get user profile');
			}

			const data = await response.json();
			console.log("data ===");
			console.log(data.image_url);
			const profile: Profile_42 = {
				id: data.id,
				username: data.login,
				email: data.email,
				avatar: data.image_url,
			};
			return profile;
		}
	}

	// async signin_42_token(
		// 	@Res() response: Response,
		// 	id: number,
		// 	email: string,
		// ): Promise<Response> {
			// 	// generate tokens
			// 	const tokens = await this.generateTokens(id, email);
			// 	// update refresh token in DB
			// 	await this.updateRefreshToken(id, tokens.refresh_token);
			// 	// generate URL for token
			// 	const url = new URL(process.env.SITE_URL);
			// 	url.port = process.env.FRONT_PORT;
// 	url.pathname = '/auth';
// 	url.searchParams.append('access_token', tokens['access_token']);
// 	// send response to front
// 	response.status(302).redirect(url.href);
// 	return response;
// }
// async validateUser(profileId: number): Promise<User> {
	// 	const user = await this.userService.getUser(profileId);
// 	// if (!user) {
	// 	// 	return await this.usersService.create({ profileId });
	// 	// }
	// 	return user;
	// }
	// Verify if the user is already in the database, if not add it to the db
	// async validateUser(userInfo: { username: string }) {
// 	const user = await this.prisma.user.findUnique({
// 		where: {
// 			username: userInfo.username
// 		}
// 	})
// 	if (user) {
	// 		// this.userService.updateUser(user.id, { status: 'login' })
	// 		return user
	// 	}
	// }
