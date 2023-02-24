import { Module } from '@nestjs/common';
import { ChatMessController } from './chat-mess.controller';
import { ChatMessService } from './chat-mess.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ChatMessController],
  providers: [ChatMessService]
})
export class ChatMessModule {}
