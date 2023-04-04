import { Module } from '@nestjs/common';
import { Chatroom2Controller } from './chatroom2.controller';
import { ChatroomService } from './chatroom2.service';

@Module({
  controllers: [Chatroom2Controller],
  providers: [ChatroomService],


  //a commenter partie Theo
// import { Module, forwardRef } from '@nestjs/common';
// import { ChatroomController } from './chatroom2.controller';
// import { ChatroomService } from './chatroom2.service';
// import { PrismaModule } from '../../prisma/prisma.module';

// @Module({
//   imports: [forwardRef(() => PrismaModule)],
//   controllers: [ChatroomController],
//   providers: [ChatroomService]
})
export class ChatroomModule {}
