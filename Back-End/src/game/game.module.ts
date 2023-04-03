import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [forwardRef(() => PrismaModule)],
    controllers: [GameController],
    providers: [GameService],
})
export class GameModule {}
