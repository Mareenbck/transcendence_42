import { AuthGuard } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { AuthService } from "../auth.service";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(readonly authService: AuthService) {
		super();
	}
}

