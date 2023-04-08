import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
<<<<<<< HEAD
import { UserService } from 'src/user/user.service';
import { GameDto } from './dto/game.dto';
import { TwoFaUserDto } from 'src/auth/dto/2fa.dto';
import { UserDto } from 'src/user/dto/user.dto';

=======


//////
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
//////
>>>>>>> 469043f (single socket for all FE WITH TOKEN)

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService, private userService: UserService){}

<<<<<<< HEAD
  async create({playerOneId, playerTwoId, winnerId, score1, score2}) {
    return await this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});
=======
//////////////////////////////////////
//////////////////////////////////////
// Les infos sur les sockets et l'accès au serveur Global
// Plus besoin de gameGateway
  public server: Server = null;
  public userSockets: UsersSockets;
///////////////////////////////////////
////////////////////////////////////////


  create({playerOneId, playerTwoId, winnerId, score1, score2}) {
    return this.prisma.game.create({data: { playerOneId, playerTwoId, winnerId, score1, score2}});
>>>>>>> 469043f (single socket for all FE WITH TOKEN)
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

  async updateUserXPAndLevel(userId: number, allGames: GameDto[]) {
    const xpPerWin = 25;
    const numWins = allGames.filter(game => game.winnerId === userId).length;
    const newXP = numWins * xpPerWin;

    let newLevel = Math.floor(newXP / 100);

    const moduloXp = newXP % 100;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: moduloXp,
        level: newLevel,
      },
    });

    return user;
}

}
