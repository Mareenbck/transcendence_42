import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";
import { forwardRef } from '@nestjs/common';
import { UserModule } from "src/user/user.module";
import { AppModule } from "src/app.module";
import { TwoFactorAuthenticationController } from "./2FA/2FactorAuth.controller";
import { TwoFactorAuthService } from "./2FA/2FactorAuth.service";
import { Jwt2faStrategy } from "./strategy/jwt-2fa.strategy";
import { FortyTwoStrategy } from "./strategy/FortyTwoStrategy";

@Module({
	imports: [
		JwtModule.register({}),
		forwardRef(() => AppModule),
		forwardRef(() => UserModule)],
	controllers: [AuthController, TwoFactorAuthenticationController],
	providers: [
		AuthService,
		JwtStrategy,
		TwoFactorAuthService,
		Jwt2faStrategy,
		FortyTwoStrategy,
	 	],
	exports: [AuthService],
})
export class AuthModule {}
