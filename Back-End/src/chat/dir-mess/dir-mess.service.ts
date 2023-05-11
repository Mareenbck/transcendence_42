import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, Injectable} from '@nestjs/common';
import { DirectMessage } from '@prisma/client';
import { DirMessDto } from './dir-mess.dto';

@Injectable()
export class DirMessService {
  constructor(private prisma: PrismaService){}

  create({content, receiver, author}) {
    return this.prisma.directMessage.create({data: {content, receiver, author}});
  }

  findAll() {
    return this.prisma.directMessage.findMany();
  }

  findSome(me: number, friend: number) {
    return this.prisma.directMessage.findMany({
      where: {
        OR: [
          { AND: [ {author: +me},
                   {receiver: +friend} ]
          },
          { AND: [ {author: +friend},
                   {receiver: +me} ]
          },
        ]
      }
    });
  }

	async getLastestMessage(userId: number) {
	const user = await this.prisma.user.findUnique({
		where: { id: userId },
		include: {
		dirMessReceived: {
			orderBy: { createdAt: 'desc' },
			take: 1,
			include: { userA: true, userR: true },
		},
		dirMessEmited: {
			orderBy: { createdAt: 'desc' },
			take: 1,
			include: { userA: true, userR: true },
		},
		},
	});

	return user;
	};
}



