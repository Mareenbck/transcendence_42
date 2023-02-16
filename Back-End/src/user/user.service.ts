import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) { }

	async createUser(email: string, username: string, hash: string): Promise<User> {
		const user = await this.prisma.user.create({
			data: {
				email,
				username,
				hash,
			},
		});
		return user;
	}

	async getUser(id: number) {
		if (id === undefined) {
			throw new BadRequestException('Undefined user ID');
		}
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: id,
				},
				rejectOnNotFound: true,
			});
			const userDTO = plainToClass(UserDto, user);
			return userDTO;
		} catch (error) {
			throw new BadRequestException('getUser error : ' + error);
		}
	}
}