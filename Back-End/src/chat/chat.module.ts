import { Module,forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';
import { ChatroomService } from "src/chat/chatroom2/chatroom2.service";

@Module({
  imports: [forwardRef(() => PrismaModule)],
  controllers: [],
  providers: [ChatService, UserService, ChatroomService]
})
export class ChatModule {}
