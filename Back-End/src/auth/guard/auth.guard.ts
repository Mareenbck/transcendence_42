import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly authService: AuthService) { }

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			throw new UnauthorizedException('No authorization header');
		}
		const token = authHeader.replace('Bearer ', '');
		const user = await this.authService.verifyAccessToken(token);
		if (!user) {
			throw new UnauthorizedException('Invalid token');
		}
		req.user = user;
		return true;
	}
}

// AuthGuard n'étend pas la classe AuthGuard de NestJS car il n'utilise pas de stratégie d'authentification spécifique. Au lieu de cela, il vérifie manuellement le jeton d'authentification en utilisant un service AuthService.Dans la méthode canActivate, nous récupérons la requête HTTP et extrayons le jeton d'authentification. Ensuite, nous vérifions le jeton en appelant la méthode verifyAccessToken de notre service AuthService. Si le jeton est invalide, nous lançons une exception. Sinon, nous stockons l'utilisateur dans la propriété user de la requête et renvoyons true.
