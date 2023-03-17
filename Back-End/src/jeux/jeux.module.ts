import { Module } from '@nestjs/common';
//import { GamesService } from './jeux.service';
import { JeuxController } from './jeux.controller';

@Module({
  controllers: [JeuxController],
//  providers: [GamesService]
})
export class JeuxModule {}
