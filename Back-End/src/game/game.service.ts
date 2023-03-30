import { Injectable } from '@nestjs/common';
import { CreateJeuDto } from './dto/create-game.dto';
import { UpdateJeuDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  create(createGameDto: CreateJeuDto) {
    return 'This action adds a new game';
  }

  findAll() {
    return `This action returns all games`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateJeuDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}


