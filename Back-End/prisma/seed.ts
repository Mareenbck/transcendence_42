import { PrismaClient } from '@prisma/client';
import { insert_games } from './games';
import { insert_achievements } from './achievements';
import { insert_users } from './users';
import { insert_direct_messages } from './direct_messages';
import { create_friendship } from './friendships';

export const prisma = new PrismaClient()

async function main() {
await prisma.$connect();
	console.log(`Start seeding ...`);
	const usrsSize: number = (
		await prisma.user.findMany({
			select: {
				id: true,
			},
		})
	).length;
	const sizeGames: number = (
		await prisma.game.findMany({
			select: {
			id: true,
			},
		})
	).length;
	const sizeAchievements: number = (
		await prisma.achievement.findMany({
			select: {
			id: true,
			},
		})
	).length;
	const sizeDM: number = (
		await prisma.directMessage.findMany({
			select: {
			id: true,
			},
		})
	).length;
	const sizeFriend: number = (
		await prisma.friendship.findMany({
			select: {
			id: true,
			},
		})
	).length;
	if (usrsSize == 0) {
		await insert_users();
	}
	if (sizeAchievements == 0) {
		await insert_achievements();
	}
	if (sizeGames == 0) {
		await insert_games();
	}
	if (sizeDM == 0) {
		await insert_direct_messages();
	}
	if (sizeFriend == 0) {
		await create_friendship();
	}
	console.log(`Seeding finished.`);
}

// Call the seed function
main()
.then(async () => {
	await prisma.$disconnect();
})
.catch(async (e) => {
	console.error(e);
	await prisma.$disconnect();
	process.exit(1);
});

