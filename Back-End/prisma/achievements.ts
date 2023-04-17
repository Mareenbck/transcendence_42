import { Achievement, Prisma } from '@prisma/client';
import { prisma } from './seed';

export async function insert_achievements() {
	console.log('Creation achievement');
	const achievements: Prisma.AchievementCreateInput[] = [
		{
			name: 'Welcome',
			description: 'Login for the first time',
			icon: '../../public/achievements/Welcome.jpg',
			points: 10,
		},
		{
			name: 'Rookie',
			description: 'Play for the first time',
			icon:'../public/achievements/Rookie.png',
			points: 20,
		},
		{
			name: 'Combative',
			description: 'Victory against a player ranked higher',
			icon: '../public/achievements/Combative2.png',
			points: 50,
		},
		{
			name: 'Winner',
			description: 'Win for the first time',
			icon: '../public/achievements/Victory.png',
			points: 30,
		},
		{
			name: 'Famous',
			description: 'Get your first friend',
			icon: '../public/achievements/Famous.png',
			points: 20,
		},
		{
			name: 'Federator',
			description: 'Become admin of your first channel',
			icon: '../public/achievements/Federator.png',
			points: 20,
		},
	];

	for (let i = 0; i < achievements.length; i++) {
		const achievement: Achievement = await prisma.achievement.create({
			data: achievements[i],
		});
		console.log( `Achievement ${achievement.name} create at id: ${achievement.id} `,);
	}
}
