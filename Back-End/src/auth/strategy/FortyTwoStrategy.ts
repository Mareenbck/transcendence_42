import { PassportStrategy } from '@nestjs/passport';
// import { Strategy as FortyTwoStrategy } from 'passport-42';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-42';

export interface Profile_42 {
	id: number;
	username: string;
	email: string;
	avatar: string;
}

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42-strategy') {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.FORTYTWO_CLIENT_ID,
			clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
			callbackURL: process.env.FORTYTWO_CALLBACK_URL,
			profileFields:
			{
				id: 'id',
				username: 'login',
				email: 'email',
				avatar: 'avatar',
			}
		});
	}

	async getIntraUrl(): Promise<string> {
		const apiUrl = process.env.FORTYTWO_API_URL;
		if (!apiUrl) {
			throw new Error('FortyTwo API URL is not set');
		}
		return apiUrl;
	}

	validate(accessToken: string, refreshToken: string, profile: Profile_42) {
		return profile;
	}
}
