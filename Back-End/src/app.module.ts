import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { GlobalGateway } from './gateway/global.gateway';
import { GlobalModule } from './gateway/global.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatMessModule } from './chat/chat-mess/chat-mess.module';
import { DirMessModule } from './chat/dir-mess/dir-mess.module';
import { ChatroomModule } from './chat/chatroom2/chatroom2.module';
import { ChatService } from './chat/chat.service';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { FriendshipModule } from './friendship/friendship.module';
import { GlobalService } from './gateway/global.service';
import { ChatroomService } from './chat/chatroom2/chatroom2.service';

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
		ChatModule,
		ChatMessModule,
		DirMessModule,
		GameModule,
		GlobalModule,
	],
	providers: [
    	GlobalGateway,
		GlobalService,
		GameService,
		ChatService,
		ChatroomService,
		UserModule,
    ],
	exports: [JwtModule],
})
export class AppModule {}
