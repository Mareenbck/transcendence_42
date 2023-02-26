import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatroomModule } from './chat/chatroom/chatroom.module';
import { ChatMessModule } from './chat/chat-mess/chat-mess.module';
import { DirMessModule } from './chat/dir-mess/dir-mess.module';
import { Chatroom2Module } from './chat/chatroom2/chatroom2.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		PrismaModule,
		JwtModule.register({ secret: process.env.JWT_SECRET }),
		ChatroomModule,
		ChatMessModule,
		DirMessModule,
		Chatroom2Module,
	],
  providers: [ChatGateway],
})
export class AppModule {}
