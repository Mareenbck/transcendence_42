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

}
