import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  providers: [ChatGateway],
})
export class AppModule {}
