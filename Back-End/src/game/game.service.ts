import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';




@Injectable()
export class GameService {
  constructor(private prisma: PrismaService){}

  create({playerOneId, playerTwoId, winnerId, score1, score2}) {
    return this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});
  }

  getGames() {
    return this.prisma.game.findMany(
      { include: {playerOne: true, playerTwo: true, winner: true}}
    );
  }
}
