import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

//Le constructeur contient les champs d'authentification qui seront envoyés par le front-end via la route POST de connexion (email, mot de passe).
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(config: ConfigService, private userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		})
	}

	// async validate(data: { sub: number; email: string }) {
	// 	return this.userService.getByEmail(data.email)
	// 	// const user = await this.prisma.user.findUnique({
	// 	// 	where: {
	// 	// 		id: data.sub,
	// 	// 	},
	// 	// });
	// 	// return user;
	// }

	async validate(payload: any) {
		console.log("payload------>")
		console.log(payload.sub)
		return { userId: payload.sub, email: payload.email };
	  }
}
// A MODIFIER ?
// La méthode validate va utiliser la méthode validateUser que nous avons créée plus tôt.
// Si elle ne retourne pas d'utilisateur, alors elle lancera une erreur 401 Unauthorized, sinon elle retournera l'utilisateur sans le mot de passe.
