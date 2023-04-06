import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';


@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private userService: UserService){}

  async create({playerOneId, playerTwoId, winnerId, score1, score2}) {
    return await this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});
  }

  async getGames() {
    return await this.prisma.game.findMany(
      { include: {playerOne: true, playerTwo: true, winner: true}}
    );
  }

  async getUserGames(userId: number): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          { playerOneId: userId },
          { playerTwoId: userId },
          { winnerId: userId }
        ]
      },
      include: {
        playerOne: true,
        playerTwo: true,
        winner: true
      }
    });
    return games;
  }

}
