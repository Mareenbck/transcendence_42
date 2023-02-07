import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					url: 'postgresql://user:password@postgres:5432/mydb?connect_timeout=300'
				},
			},
		});
	}
}

// import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
// 	async onModuleInit() {
// 		await this.$connect();
// 	}

// 	async enableShutdownHooks(app: INestApplication) {
// 		this.$on('beforeExit', async () => {
// 			await app.close();
// 		});
// 	}
// }

// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService
// 	extends PrismaClient
// 	implements OnModuleInit, OnModuleDestroy {
// 	constructor() {
// 		super();
// 	}

// 	async onModuleInit() {
// 		await this.$connect();
// 	}

// 	async onModuleDestroy() {
// 		await this.$disconnect();
// 	}
// }

