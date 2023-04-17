import { User, Prisma } from '@prisma/client';
import { prisma } from './seed';
import * as argon from 'argon2';

export async function insert_users() {
	console.log('Creation user');
	const users: Prisma.UserCreateInput[] = [
		{
			email: 'e@a.com',
			username: 'Emma',
			avatar: '../upload/avatar-Wbleu.jpg',
			hash: 'secret',
		},
		{
			email: 'l@a.com',
			username: 'Lucie',
			avatar:'../upload/avatar-Wred.jpg',
			hash: 'secret',
		},
		{
			email: 'f@a.com',
			username: 'Fabien',
			avatar: '',
			hash: 'secret',
		},
		{
			email: 'm@a.com',
			username: 'Math',
			avatar: '../upload/avatar-Morange.png',
			hash: 'secret',
		},
	];

	console.log('Hashing passwords...');
	for (let i = 0; i < users.length; i++) {
		const hashedPassword = await argon.hash(users[i].hash);
		users[i].hash = hashedPassword;
	}

	console.log('Creating users...');
	for (let i = 0; i < users.length; i++) {
		const user: User = await prisma.user.create({
			data: users[i],
		});
		console.log( `User ${user.username} create at id: ${user.id} `,);
	}
}
