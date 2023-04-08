import { PrismaService } from '../prisma/prisma.service';
import { Game } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';


//////
import { Server, Socket } from "socket.io";
import UsersSockets from "src/gateway/socket.class";
//////

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService){}

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
  }

  getGames() {
    return this.prisma.game.findMany(
      { include: {playerOne: true, playerTwo: true, winner: true}}
    );
  }
}
