import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule, JwtSecretRequestType } from "@nestjs/jwt";
// import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";


@Module({
	imports: [JwtModule.register({
		// secret: ConfigService.get('JWT_SECRET'),
		// signOptions: {expiresIn: '1w'},
	})],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
