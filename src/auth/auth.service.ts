import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { User } from "@prisma/client";

@Injectable({})
export class AuthService {
	constructor(private prisma: PrismaService) {}
	signin() {
		return {msg: ' Sign in '}
	}

	signup() {
		return { msg: ' Sign up ' }
	}
}
