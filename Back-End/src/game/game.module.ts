import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { JeuxController } from './game.controller';



@Module({
    imports: [],
    controllers: [JeuxController],
    providers: [GameService, GameGateway],
    exports: [GameService]
})
export class GameModule {}


