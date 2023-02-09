import { BadRequestException, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

	async signup(dto: AuthDto) {
		//generate the password
		const hash = await argon.hash(dto.password);
		//save new user in the db
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash,
					username: dto.username,
				},
			});
			return this.signToken(user.id, user.email);
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
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
		return this.signToken(user.id, user.email);
	}

	async signToken(userId: number, email: string): Promise<{access_token: string}> {
		const data = {
			sub: userId,
			email,
		};
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(data, {
			expiresIn: '30m',
			secret: secret,
		});
		return {access_token: token};
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
