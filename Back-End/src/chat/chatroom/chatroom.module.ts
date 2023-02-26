import { Global, Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [ChatroomController],
  providers: [PrismaService, ChatroomService],
  exports: [PrismaService]
})
export class ChatroomModule {}
