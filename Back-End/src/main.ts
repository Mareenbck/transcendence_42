import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'otplib';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe( {
		whitelist: true,
		}
	));
	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:8080'],
		credentials: true
	});

	await app.listen(3000);
}
bootstrap();
