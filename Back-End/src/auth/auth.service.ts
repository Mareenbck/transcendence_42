import { BadRequestException, NotFoundException, ExecutionContext, ForbiddenException, Injectable, Res, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Auth42Dto, AuthDto, AuthTokenDto } from "./dto";
import * as argon from 'argon2';
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { SigninDto } from "./dto/signin.dto";
import { UserService } from "src/user/user.service";

export interface Profile_42 {
	username: string;
	email: string;
	avatar: string;
	ftAvatar: string;
}

interface DecodedToken {
	header: {
	  alg: string,
	  typ: string
	},
	payload: {
	  sub: string,
	  email: string,
	  iat: number,
	  exp: number
	},
	signature: string
  }

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signup(dto: AuthDto): Promise<AuthTokenDto> {
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

	async validateUser(email: string, pass: string): Promise<any> {
		const user = await this.userService.getByEmail(email);
		if (!user)
			throw new ForbiddenException('Credentials incorrect');
		const pwMatches = await argon.verify(user.hash, pass);
		if (pwMatches) {
			return user;
		}
		return null;
	  }

	async signin(dto: SigninDto) {
		const user = await this.validateUser(dto.email, dto.password)
		if (!user)
			throw new ForbiddenException('Credentials incorrect');
		const tokens = await this.generateTokens(user.id, user.email, user.twoFA);
		// update refresh token
		await this.updateRefreshToken(user.id, tokens.refresh_token);
		return tokens;
	}

	async updateStatus(tokens: AuthTokenDto) {
		const user = await this.verifyAccessToken(tokens.access_token);
		if (!user)
			throw new ForbiddenException('Credentials incorrect');
		await this.prisma.user.update({
				where: { id: user.id },
				data: { status: 'ONLINE' },
		});
		await this.userService.updateAchievement(user.id, 'Welcome');
	}

	async signin_42(profile: Profile_42): Promise<User> {
		// check if user exists
		let user = await this.userService.getByEmail(profile.email);
		if (!user) {
			return this.create_42_user(profile);
		}
		return user;
	}

	async create_42_user(profile: Profile_42): Promise<User> {
		const { email, username, avatar, ftAvatar } = profile;
		// generate random password
		const rdm_string = this.generate_random_password();
		// hash password using argon2
		const hash = await argon.hash(rdm_string);
		//create new user
		const user = await this.userService.createUser(
			email,
			username,
			hash,
			avatar,
			ftAvatar,
			);
		return user;
	}

	async signout(user: any) {
		const { userId } = user;
		const delog = await this.prisma.user.updateMany({
			where: {
				id: userId,
				hashedRtoken: { not: null },
			},
			data: {
				hashedRtoken: null,
				status: 'OFFLINE',
			},
		});
		return userId;
	}

	async generateTokens(userId: number, email: string, is2FA = false): Promise<AuthTokenDto> {
		const payload = {
			sub: userId,
			email: email,
		};
		const secret = this.config.get('JWT_SECRET');
		const access_token_expiration = this.config.get('ACCESS_TOKEN_EXPIRATION');
		const refresh_token_expiration = this.config.get('REFRESH_TOKEN_EXPIRATION');
		const Atoken = await this.jwt.sign(payload, {
			expiresIn: access_token_expiration,
			secret: secret,
		});
		const Rtoken = await this.jwt.sign(payload, {
			expiresIn: refresh_token_expiration,
			secret: secret,
		});
		return {
			access_token: Atoken,
			refresh_token: Rtoken,
		};
	}

	async refresh_token(refreshToken: string): Promise<AuthTokenDto> {
		const decodedToken = this.jwt.decode(refreshToken, { complete: true }) as DecodedToken;
		if (!decodedToken) {
			throw new BadRequestException('Invalid token');
		}
		const userId = decodedToken.payload.sub;
		const user = await this.userService.getUser(parseInt(userId));
		// Check if user exists and is logged in
		if (!user || !user.hashedRtoken) {
			throw new ForbiddenException('Invalid Credentials');
		}
		// Verify hashed Refresh Token
		const pwMatches = await argon.verify(user.hashedRtoken, refreshToken);
		if (!pwMatches) {
			throw new ForbiddenException('Invalid Credentials');
		}
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
		const user = await this.prisma.user.update({
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
			if (!decoded) {
				throw new BadRequestException('Invalid access token');
			}
			return await this.userService.getByEmail(decoded.email);
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

			const tokens = await response.json();

			return {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token
			};
		}

	async getFortyTwoUserProfile(accessToken: string): Promise<Profile_42> {
		try {
			const headers = { Authorization: `Bearer ${accessToken}` };
			const url = 'https://api.intra.42.fr/v2/me';

			const response = await fetch(url, { headers });
			if (!response.ok) {
				throw new Error('Failed to get user profile');
			}

			const data = await response.json();
			const profile: Profile_42 = {
				username: data.login,
				email: data.email,
				avatar: '',
				ftAvatar: data.image.versions.small,
			};
			return profile;
		} catch (error) {
			console.log(error);
		}
	}

	generate_random_password(): string {
		// generate random password for 42 User
		const password =
			Math.random().toString(36).slice(2, 15) +
			Math.random().toString(36).slice(2, 15);
		return password;
	}
}
