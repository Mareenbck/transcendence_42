import { prisma } from './seed';

export async function insert_games() {
	console.log('Find users');
	// Find existing users in the database
	const emma = await prisma.user.findUnique({ where: { id: 1 } })
	const lucie = await prisma.user.findUnique({ where: { id: 2 } })
	const fabien = await prisma.user.findUnique({ where: { id: 3 } })
	const math = await prisma.user.findUnique({ where: { id: 4 } })

	console.log('Creating games');
	// Create games and connect them to existing users
	const game1 = await prisma.game.create({
	  data: {
		playerOne: { connect: { id: emma.id } },
		playerTwo: { connect: { id: lucie.id } },
		winner: { connect: { id: emma.id } },
		score1: 10,
		score2: 2,
	  },
	})
	const game2 = await prisma.game.create({
	  data: {
		playerOne: { connect: { id: emma.id } },
		playerTwo: { connect: { id: fabien.id } },
		winner: { connect: { id: fabien.id } },
		score1: 0,
		score2: 10,
	  },
	})

	const game3 = await prisma.game.create({
	  data: {
		playerOne: { connect: { id: lucie.id } },
		playerTwo: { connect: { id: math.id } },
		winner: { connect: { id: math.id } },
		score1: 5,
		score2: 10,
	  },
	})

	const game4 = await prisma.game.create({
	  data: {
		playerOne: { connect: { id: lucie.id } },
		playerTwo: { connect: { id: emma.id } },
		winner: { connect: { id: lucie.id } },
		score1: 10,
		score2: 6,
	  },
	})

	const game5 = await prisma.game.create({
	  data: {
		playerOne: { connect: { id: lucie.id } },
		playerTwo: { connect: { id: math.id } },
		winner: { connect: { id: math.id } },
		score1: 8,
		score2: 10,
	  },
	})

	console.log("Updating users with games")

	await prisma.user.update({
	  where: { id: emma.id },
	  data: {
		playerOne: {
		  connect: [{ id: game1.id }, { id: game2.id }]
		},
		playerTwo: {
		  connect: [{ id: game4.id }]
		},
	}
	})

	await prisma.user.update({
	  where: { id: lucie.id },
	  data: {
		playerOne: {
			connect: [{ id: game3.id }, { id: game4.id }, { id: game5.id }]
		  },
		playerTwo: {
		  connect: [{ id: game1.id }]
		},
	  }
	})

	await prisma.user.update({
	  where: { id: fabien.id },
	  data: {
		playerTwo: {
		  connect: [{ id: game2.id }]
		},
	  }
	})

	await prisma.user.update({
	  where: { id: math.id },
	  data: {
		playerTwo: {
		  connect: [{ id: game3.id }, { id: game5.id }]
		},
	  }
	})

  }
