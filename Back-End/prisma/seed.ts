import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';

const prisma = new PrismaClient()


async function main() {
  await prisma.user.deleteMany({}) // never in production
  await prisma.chatroom.deleteMany({}) // never in production
  await prisma.chatroomMessage.deleteMany({}) // never in production
  await prisma.jeu.deleteMany({}) // never in production

  const user = await prisma.user.create({
    data: {
      email: 'theo@theo.fr',
      username: 'theo',
      hash: 'ezfdfvdfvdfve',
    }
  })
  console.log(user)



}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
