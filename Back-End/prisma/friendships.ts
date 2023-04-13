import { Prisma, Friendship } from '@prisma/client';
import { prisma } from './seed';

export async function create_friendship() {
	console.log('Find users');
	// Find existing users in the database
	const emma = await prisma.user.findUnique({ where: { id: 1 } })
	const lucie = await prisma.user.findUnique({ where: { id: 2 } })


	console.log('Creating friendship...');
	const friendship: Friendship = await prisma.friendship.create({
		data: {
			status: 'ACCEPTED',
			requester: {
			connect: { id: emma.id },
		},
		  receiver: {
			connect: { id: lucie.id },
		},
	},
});

	// Ajouter l'amitié aux deux utilisateurs
	await prisma.user.update({
		where: { id: emma.id },
		data: {
		  friends: { connect: { id: lucie.id } },
		  achievements: {
			create: {
			  achievement: { connect: { name: 'Famous' } },
			}
		  }
		},
	  });

	  await prisma.user.update({
		where: { id: lucie.id },
		data: {
		  friends: { connect: { id: emma.id } },
		  achievements: {
			create: {
			  achievement: { connect: { name: 'Famous' } },
			}
		  }
		},
	  });

	// const createdFriendship = await prisma.friendship.create({
	// 	data: friendship,
	// });
	console.log(`Friendship ${friendship.id} created`);
	console.log(`Friendship created between ${emma.username} et ${lucie.username}`);
}
