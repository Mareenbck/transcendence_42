import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async signup(dto: AuthDto) {
		//generate the password
		const hash = await argon.hash(dto.password);
		console.log(hash);
		console.log(dto.email);
		console.log(dto.username);
		//save new user in the db
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				username: dto.username,
				hash,
			},
		});
		//return the saved user
		return user;
	}

	signin() {
		return {msg: ' Sign in '}
	}

}
