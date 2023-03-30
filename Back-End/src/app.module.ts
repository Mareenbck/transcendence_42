import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatMessModule } from './chat/chat-mess/chat-mess.module';
import { DirMessModule } from './chat/dir-mess/dir-mess.module';
import { ChatroomModule } from './chat/chatroom2/chatroom2.module';
import { JeuxModule } from './jeux/jeux.module';
import { GameModule } from './game/game.module';
import { GameGateway } from './game/game.gateway';
import { FriendshipModule } from './friendship/friendship.module';
import { GlobalModule } from './gateway/global.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		FriendshipModule,
		PrismaModule,
		JwtModule.register({ secret: `${process.env.JWT_SECRET}` }),
		ChatroomModule,
		ChatMessModule,
    GlobalModule,
		DirMessModule,
		JeuxModule,
		GameModule,

		// PassportModule.register({ defaultStrategy: '42' }),
	],
	providers: [ChatGateway, GameGateway],
	exports: [JwtModule],
})
export class AppModule {}
