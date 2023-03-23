import { Module } from '@nestjs/common';
import { ChatMessController } from './chat-mess.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatMessController],
})
export class ChatMessModule {}
