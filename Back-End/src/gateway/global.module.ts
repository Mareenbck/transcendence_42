import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { GameService } from "src/game/game.service";
import { GameController } from "src/game/game.controller";
import { GlobalGateway } from "./global.gateway";
import { GlobalService } from "src/gateway/global.service";
import { ChatService } from "src/chat/chat.service";
import { ChatroomService } from "src/chat/chatroom2/chatroom2.service";

@Global()
@Module({
  imports: [],
  controllers: [GameController],
  providers: [GlobalService, ChatroomService, ChatService, PrismaService, GameService, UserService],
  exports: [GlobalService],
})
export class GlobalModule {}


