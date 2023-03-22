
import {
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

let users = [];

const addUser = (userId, socketId) => {
  console.log(userId);
  !users.some((user) => +user.userId.userId === +userId.userId) &&
    users.push({userId, socketId})
  // users.push(userId)
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
  roomUsers = roomUsers.filter( room => +room.socketId !== +socketId);
}

const getUser = (userId) => {
  return users.find(user => +user.userId.userId === +userId)
}


let roomUsers = [];

const addRoomUser = (roomId, userId, socketId) => {
  roomUsers = roomUsers.filter( room => +room.userId !== +userId);
  roomId && roomUsers.push({roomId, userId, socketId});
}

// @WebSocketGateway(8001, { cors: {origin: "http://localhost:8080",}, })
@WebSocketGateway(8001, { cors: 'http://localhost/chat/message' })

export class ChatGateway {
  @WebSocketServer()
  server;

  onModuleInit(){
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');

      socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        this.server.emit("getUsers", users);
      });

      socket.on("userRoom", ({roomId, userId}) => {
        addRoomUser(roomId, userId, socket.id);
        console.log(roomUsers);
      });

      socket.on("sendMChat", ({authorId, chatroomId, content }) => {
        const roomUs = roomUsers.filter( roomU => +roomU.roomId === chatroomId);
        for(const roomU of roomUs) {
          this.server.to(roomU.socketId).emit("getMChat", {
            authorId,
            chatroomId,
            content,
          });
        }
      });

      socket.on("sendMD", ({content, author, receiver}) => {
        const user = getUser(receiver);
        this.server.to(user.socketId).emit("getMD", {
          content,
          author,
          receiver,
        });
      });

      socket.on("sendConv", ({author, content,}) => {
        for(const user of users) {
          this.server.to(user.socketId).emit("getConv", {
            content,
          });
        }s
      });

      socket.on('disconnect', () => {
        console.log(socket.id);
        console.log('Disconnected');
        removeUser(socket.id);
        this.server.emit("getUsers", users);
      });
    }
  )};
}
