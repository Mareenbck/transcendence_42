import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { forwardRef } from '@nestjs/common';
import { UserModule } from "src/user/user.module";
import { AppModule } from "src/app.module";
import { TwoFactorAuthenticationController } from "./2FA/2FactorAuth.controller";
import { TwoFactorAuthService } from "./2FA/2FactorAuth.service";
import { Jwt2faStrategy } from "./strategy/jwt-2fa.strategy";
import { FortyTwoStrategy } from "./strategy/42.strategy";
import { JwtStrategy } from "./strategy";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '600000s' },
		}),
		forwardRef(() => AppModule),
		UserModule,
		PassportModule,
		],
	controllers: [AuthController, TwoFactorAuthenticationController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		TwoFactorAuthService,
		Jwt2faStrategy,
		FortyTwoStrategy,
	 	],
	exports: [AuthService],
})
export class AuthModule {}
