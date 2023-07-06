import { Prisma, DirectMessage } from '@prisma/client';
import { prisma } from './seed';

export async function insert_direct_messages() {
	console.log('Find users');
	const emma = await prisma.user.findUnique({ where: { id: 1 } })
	const lucie = await prisma.user.findUnique({ where: { id: 2 } })
	const fabien = await prisma.user.findUnique({ where: { id: 3 } })
	const math = await prisma.user.findUnique({ where: { id: 4 } })

	console.log('Creating direct messages...');
	const directMessages: Prisma.DirectMessageCreateInput[] = [
		{
			content: 'Hello lucie, how are you?',
			userA: { connect: { id: emma.id } },
			userR: { connect: { id: lucie.id } },
		},
		{
			content: 'I am doing well, thanks for asking!',
			userA: { connect: { id: lucie.id } },
			userR: { connect: { id: emma.id } },
		},
		{
			content: 'Hey emma, want to hang out later?',
			userA: { connect: { id: fabien.id } },
			userR: { connect: { id: emma.id } },
		},
		{
			content: 'Sure, let me know where and when!',
			userA: { connect: { id: emma.id } },
			userR: { connect: { id: fabien.id } },
		},
	];

	for (let i = 0; i < directMessages.length; i++) {
		const directMessage: DirectMessage = await prisma.directMessage.create({
			data: directMessages[i],
		});
		console.log(`Direct message ${directMessage.id} created`);
	}
}
