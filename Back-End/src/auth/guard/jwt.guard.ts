import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from "../auth.service";


@Injectable()
export class JwtGuard extends AuthGuard('full') {
	// constructor() {
	// 	super();
	// }

	// canActivate(context: ExecutionContext) {
	// 	return super.canActivate(context);
	// }
}

// JwtGuard étend la classe AuthGuard de NestJS et utilise la stratégie 'jwt'.
// Il utilise également un service AuthService pour vérifier le jeton JWT.
// Dans la méthode canActivate, nous récupérons la requête HTTP et appelons la méthode canActivate de la classe parent.
