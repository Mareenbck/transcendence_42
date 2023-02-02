import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					url: 'postgresql://user:password@localhost:5432/db?schema=public'
				},
			},
		});
	}
}
