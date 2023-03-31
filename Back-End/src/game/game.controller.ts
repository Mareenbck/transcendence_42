import { Controller, Get, Post, UseGuards, Body} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtGuard} from 'src/auth/guard';
import { GameDto } from './dto/game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
//  @UseGuards(JwtGuard)
  async getGames(): Promise<GameDto[]> {
    const allGames = await this.gameService.getGames();
  return allGames;
  }

  @Post('/newGame')
//  @UseGuards(JwtGuard)
  async create(@Body() {playerOneId, playerTwoId, winnerId, score1, score2}):
  Promise<GameDto> {
    const game = await this.gameService.create({
      playerOneId,
      playerTwoId,
      winnerId,
      score1,
      score2
    });
    return game;
  }
}
