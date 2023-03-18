
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
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

@WebSocketGateway(8001, { cors: {origin: "http://localhost:8080",}, })
export class ChatGateway {
  //implements OnGatewayConnection, OnGatewayDisconnect
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

      socket.on("getMDNN", ({author, receiver, content }) => {
        const user = getUser(receiver);
        console.log(user);
        this.server.to(user.socketId).emit("getMD", {
          author,
          receiver,
          content,
        });
      });


      socket.on('disconnect', () => {
        console.log(socket.id);
        console.log('Disconnected');
        removeUser(socket.id);
        this.server.emit("getUsers", users);
      });
    });
  };


  @SubscribeMessage('messagex')
  handleMessage(@MessageBody() message2): void {
    console.log(message2);
    this.server.emit('message2', message2);
  }

  @SubscribeMessage('m3')
  onNewMesage(@MessageBody() body: any) {
    console.log(body.authorId);
  //this.server.emit('onMessage', {
  //  msg: 'NewMessage',
  //  content: body,
  //});
  }
  //  this.server.emit('message', content);

}
