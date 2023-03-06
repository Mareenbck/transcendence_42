import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from "../auth.service";


@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	// constructor(private readonly authService: AuthService) {
	// 	super();
	// }
	// async canActivate(context: ExecutionContext) {
	// 	const req = context.switchToHttp().getRequest();
	// 	const authHeader = req.headers.authorization;
	// 	if (!authHeader) {
	// 		throw new UnauthorizedException('No authorization header');
	// 	}
	// 	const token = authHeader.replace('Bearer ', '');
	// 	const user = await this.authService.verifyAccessToken(token);
	// 	if (!user) {
	// 		throw new UnauthorizedException('Invalid token');
	// 	}
	// 	req.user = user;
	// 	return true;
	// }
}

// JwtGuard étend la classe AuthGuard de NestJS et utilise la stratégie 'jwt'.
// constructor() {
// 	super();
// }

// canActivate(context: ExecutionContext) {
// 	return super.canActivate(context);
// }
// Il utilise également un service AuthService pour vérifier le jeton JWT.
// Dans la méthode canActivate, nous récupérons la requête HTTP et appelons la méthode canActivate de la classe parent.
