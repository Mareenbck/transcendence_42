import { Controller, Get, Post, UseGuards, Param, Body} from '@nestjs/common';
import { GameService } from './game.service';
import { JwtGuard} from 'src/auth/guard';
import { GameDto } from './dto/game.dto';
import { UserService } from 'src/user/user.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService,
              private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getGames(): Promise<GameDto[]> {
    const allGames = await this.gameService.getGames();
  return allGames;
  }

  @Post('/newGame')
  @UseGuards(JwtGuard)
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

	@Get('/allGames/:id')
	@UseGuards(JwtGuard)
	async getAllUserGames(@Param('id') userId: string) {
		const allGames = await this.gameService.getUserGames(parseInt(userId));
		return allGames;
	}

	@Get('/level/:id')
	@UseGuards(JwtGuard)
	async getUserLevel(@Param('id') userId: string) {
		const allGames = await this.gameService.getUserGames(parseInt(userId));
	//
		const user = await this.gameService.updateUserXPAndLevel(parseInt(userId), allGames);
		return user;
	}

	@Get('/rank/:id')
	async getUserRank(@Param('id') id: string): Promise<{ rank: number }> {
		const rank = await this.gameService.getUserRankByWins(parseInt(id));
		return { rank };
	}
}

