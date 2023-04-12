import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [forwardRef(() => PrismaModule), UserModule],
    controllers: [GameController],
    providers: [GameService, UserService],
    exports: [GameService],
})
export class GameModule {}
