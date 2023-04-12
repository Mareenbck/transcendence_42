import { PrismaClient } from '@prisma/client';
import { insert_games } from './games';
import { insert_achievements } from './achievements';

// Instantiate Prisma Client
export const prisma = new PrismaClient()

async function main() {
  await prisma.$connect();
    console.log(`Start seeding ...`);
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
    if (sizeGames == 0) {
      insert_games();
    }
    if (sizeAchievements == 0) {
      insert_achievements();
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

