import { Module, forwardRef } from '@nestjs/common';
import { Chatroom2Controller } from './chatroom2.controller';
import { ChatroomService } from './chatroom2.service';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
  imports: [forwardRef(() => PrismaModule)],
  controllers: [Chatroom2Controller],
  providers: [ChatroomService, UserService],

})
export class ChatroomModule {}
