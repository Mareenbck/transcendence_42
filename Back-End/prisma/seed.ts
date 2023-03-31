import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';
const prisma = new PrismaClient()

async function main() {
  await prisma.game.deleteMany({}) // never in production
  await prisma.directMessage.deleteMany({}) // never in production
  await prisma.chatroomMessage.deleteMany({}) // never in production
  await prisma.chatroom.deleteMany({}) // never in production
  await prisma.user.deleteMany({}) // never in production



  const user = await prisma.user.create({
    data: {
      email: 'theo@theo.fr',
      username: 'Emma Seed',
       hash: 'ezfe',
    }
  })
  console.log(user)

  const user2 = await prisma.user.create({
    data: {
      email: 'MAMA@dde.fr',
      username: 'Mariya Seed',
      hash: 'ezfzefzfe',
    }
  })
  console.log(user2)

  const user3 = await prisma.user.create({
    data: {
      email: 'Mddvdvdv@dde.fr',
      username: 'Bob Seed',
      hash: 'ezfzefzfesdcs',
    }
  })
  console.log(user3)

  const user4 = await prisma.user.create({
    data: {
      email: 'Mddvdvdbbv@dde.fr',
      username: 'Marine Seed',
      hash: 'ezfzefzfecececc',
    }
  })
  console.log(user4)

  const d1 = add(new Date(), { days: 1})
  const d2 = add(new Date(), { days: 2})
  const d3 = add(new Date(), { days: 3})
  const d4 = add(new Date(), { days: 4})
  const d5 = add(new Date(), { days: 5})

  const croom1 = await prisma.chatroom.create({
    data: {
      name: 'café',
      avatar: "http://localhost:8080/public/images/news.jpeg"
    }
  })
  console.log(croom1)

  const croom2 = await prisma.chatroom.create({
    data: {
      name: 'news',
      avatar: "http://localhost:8080/public/images/cafe.jpeg"
    }
  })
  console.log(croom1)

  const chatM1 = await prisma.chatroomMessage.create({
    data: {
      createdAt:     d1,
      content: 'Salut, Ca va ?',
      chatroom: {connect: { id: croom1.id}},
      author: {connect: { id: user2.id }}
    }})

  console.log(chatM1)


  const chatM2 = await prisma.chatroomMessage.create({
    data: {
      createdAt:     d2,
      content: 'Qui veut un café ?',
      chatroom: {connect: { id: croom1.id}},
      author: {connect: { id: user2.id }}
    }})

  const chatM3 = await prisma.chatroomMessage.create({
    data: {
      createdAt:     d3,
      content: 'Encore ?',
      chatroom: {connect: { id: croom1.id}},
      author: {connect: { id: user2.id }}
    }})

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

 const j1 = await prisma.game.create({
    data: {
      createdAt:     d5,
      playerOne: {connect: { id: user.id }},
      playerTwo:{connect: { id: user2.id }},
      winner:{connect: { id: user2.id }},
      score1: 10,
      score2: 8,
    }
  })
 const j2 = await prisma.game.create({
    data: {
      createdAt:     d5,
      playerOne: {connect: { id: user3.id }},
      playerTwo:{connect: { id: user4.id }},
      winner:{connect: { id: user4.id }},
      score1: 10,
      score2: 2,
    }
  })
  const j3 = await prisma.game.create({
    data: {
      createdAt:     d5,
      playerOne: {connect: { id: user3.id }},
      playerTwo:{connect: { id: user4.id }},
      winner:{connect: { id: user3.id }},
      score1: 1,
      score2: 10,
    }
  })
   const j4 = await prisma.game.create({
    data: {
      createdAt:     d5,
      playerOne: {connect: { id: user2.id }},
      playerTwo:{connect: { id: user4.id }},
      winner:{connect: { id: user2.id }},
      score1: 10,
      score2: 0,
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
