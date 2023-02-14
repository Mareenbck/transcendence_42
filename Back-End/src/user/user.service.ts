import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

interface ICreatingUser {
	email: string;
	username: string;
}

@Injectable()
export class UserService {
	// private creatingUsers: ICreatingUser[] = [];

	constructor(private readonly prismaService: PrismaService) { }

	async fetchProfileData(username: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				username: username,
			},
		});
		if (!user) return null;
		return {
			username: user.username,
			email: user.email,
		};
	}
}
