import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, Injectable, HttpException } from '@nestjs/common';
import { DirectMessage } from '@prisma/client';
import { DirMessDto } from './dir-mess.dto';
import { plainToClass } from 'class-transformer';
import { DIRMESS } from './dir-messMOCK';

@Injectable()
export class DirMessService {
  private mess = DIRMESS;

 async getDirMess() {
    return this.mess;
  }

 async postDirMess(dirMess) {
    return this.mess.push(dirMess);
  }

  async getDirMessById(id:number): Promise<any> {
    const dirMessId = Number(id);
    return new Promise((resolve) => {
      const dirMess = this.mess.find((dirMess) => dirMess.id === dirMessId);
      if (!dirMess) {
        throw new HttpException('No Message', 404);
      }
      return resolve(dirMess);
  });
  }
}
