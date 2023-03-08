import { PassportStrategy } from '@nestjs/passport';
// import { Strategy as FortyTwoStrategy } from 'passport-42';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-42';

export interface Profile_42 {
	// id: number;
	username: string;
	email: string;
	avatar: string;
	defaultAvatar: string;
}

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
	constructor(private readonly authService: AuthService) {
		super({
			clientID: process.env.FORTYTWO_CLIENT_ID,
			clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
			callbackURL: process.env.FORTYTWO_CALLBACK_URL,
			profileFields:
			{
				// id42: 'id',
				username: 'login',
				email: 'email',
				avatar: 'image_url',
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

	async validate(accessToken: string, refreshToken: string, profile: Profile_42) {
		return profile
	}
}



// @Injectable()
// export class IntraStrategy extends PassportStrategy(Strategy, '42') {
// 	constructor(private readonly authService: AuthService) {
// 		super({
// 			clientID: process.env.UID,
// 			clientSecret: process.env.SECRET,
// 			callbackURL: process.env.IP_REDIRECT,
// 			scope: ['public']
// 		});
// 	}

// 	async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<User> {
// 		const  { username } = profile;
// 		const user = {
// 			username: username,
// 			email: profile['emails'][0]['value'],
// 			password: username,
// 			login42: username
// 		}
// 		return this.authService.signin_42(profile);
// 	}
// }


