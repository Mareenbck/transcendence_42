import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';

const prisma = new PrismaClient()


async function main() {
  await prisma.user.deleteMany({}) // never in production
  await prisma.chatroom.deleteMany({}) // never in production
  await prisma.chatroomMessage.deleteMany({}) // never in production


  const user = await prisma.user.create({
    data: {
      email: 'theo@theo.fr',
      username: 'theo',
       hash: 'ezfe',
    }
  })
  console.log(user)

  const user2 = await prisma.user.create({
    data: {
      email: 'MAMA@dde.fr',
      username: 'mama',
      hash: 'ezfzefzfe',
    }
  })
  console.log(user2)

  const user3 = await prisma.user.create({
    data: {
      email: 'Mddvdvdv@dde.fr',
      username: 'mamacdcdcdc',
      hash: 'ezfzefzfesdcs',
    }
  })
  console.log(user3)

  const user4 = await prisma.user.create({
    data: {
      email: 'Mddvdvdbbv@dde.fr',
      username: 'mamacfzefzedcdcdc',
      hash: 'ezfzefzfecececc',
    }
  })
  console.log(user4)

  const d1 = add(new Date(), { days: 1})
  const d2 = add(new Date(), { days: 2})

  const croom1 = await prisma.chatroom.create({
    data: {
      name: 'dddddd',
    }
  })
  console.log(croom1)

  const chatM1 = await prisma.chatroomMessage.create({
    data: {
      createdAt:     d1,
      content: 'sdzdsd',
      chatroom: {connect: { id: croom1.id}},
      user: {connect: { id: user2.id }}
    }
  })
  console.log(chatM1)


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
