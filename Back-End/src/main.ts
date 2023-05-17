import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'otplib';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe( {
		whitelist: true,
		}
	));
	app.enableCors({
		// origin: process.env.FRONTEND_URL,
		// credentials: true
	});
	// app.enableCors({
	// 	origin: 10.11.1.3,
	// 	credentials: true
	// });
	app.get(PrismaService);
	await app.listen(3000);
}
bootstrap();
