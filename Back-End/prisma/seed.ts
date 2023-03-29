import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';
const prisma = new PrismaClient()

async function main() {
  await prisma.jeu.deleteMany({}) // never in production
  await prisma.directMessage.deleteMany({}) // never in production
  await prisma.chatroomMessage.deleteMany({}) // never in production
  await prisma.chatroom.deleteMany({}) // never in production
  await prisma.user.deleteMany({}) // never in production



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
  const d3 = add(new Date(), { days: 3})
  const d4 = add(new Date(), { days: 4})
  const d5 = add(new Date(), { days: 5})


 const chatDm1 = await prisma.directMessage.create({
    data: {
      createdAt:     d4,
      content: "Salut U1, ca va ?",
      userA: {connect: { id: user.id }},
      userR: {connect: { id: user2.id }}
    }})

 const chatDm2 = await prisma.directMessage.create({
    data: {
      createdAt:     d5,
      content: "Salut U2, bien et toi ?",
      userA: {connect: { id: user2.id }},
      userR: {connect: { id: user.id }}
    }
  })

 const j1 = await prisma.jeu.create({
    data: {
      createdAt:     d5,
      playerOne: {connect: { id: user.id }},
      playerTwo:{connect: { id: user2.id }},
      winner:{connect: { id: user2.id }},
    }
  })
 const j2 = await prisma.jeu.create({
    data: {
      createdAt:     d4,
      playerOne: {connect: { id: user3.id }},
      playerTwo:{connect: { id: user4.id }},
      winner:{connect: { id: user4.id }},
    }
  })

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
