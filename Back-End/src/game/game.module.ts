import { Module } from '@nestjs/common';
import { GameService } from './game.service';
//import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';


@Module({
    imports: [],
    controllers: [GameController],
    providers: [GameService],
})
export class GameModule {}

// import { Module } from '@nestjs/common';
// //import { GamesService } from './jeux.service';
// import { JeuxController } from './jeux.controller';

// @Module({
//   controllers: [JeuxController],
// //  providers: [GamesService]
// })
// export class JeuxModule {}

