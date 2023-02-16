import { AuthGuard } from "@nestjs/passport";
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from "../auth.service";


export class JwtGuard extends AuthGuard('jwt') {
	constructor(readonly authService: AuthService) {
		super();
	}
}

