import { Injectable } from "@nestjs/common";
// import { User } from "@prisma/client";

@Injectable({})
export class AuthService {
	signin() {
		return {msg: ' Sign in '}
	}

	signup() {
		return { msg: ' Sign up ' }
	}
}
