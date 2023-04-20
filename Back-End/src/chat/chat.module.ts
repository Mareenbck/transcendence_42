import { Module,forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [forwardRef(() => PrismaModule)],
  controllers: [],
  providers: [ChatService, UserService]
})
export class ChatModule {}
