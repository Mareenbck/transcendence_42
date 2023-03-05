import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

// Create FortyTwoAuthGuard - used access 42 API
@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
	constructor() {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const isAuthenticated = await super.canActivate(context);
		if (!isAuthenticated) {
			throw new UnauthorizedException('User not authenticated');
		}
		return true;
	}
}

// FortyTwoGuard étend également la classe AuthGuard de NestJS et utilise la stratégie '42auth'.
// Dans la méthode canActivate, nous récupérons la requête HTTP et appelons la méthode canActivate de la classe parent.
// Si l'utilisateur n'est pas authentifié, nous lançons une exception.Sinon, nous renvoyons true.
