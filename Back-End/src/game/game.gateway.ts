import { 
  MessageBody,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket
} from '@nestjs/websockets';

import {Server, Socket} from 'socket.io'

interface ball {
  x: number;
  y: number;
}

interface racket {
  x: number;
  y: number;
}

interface game {
  table_width: number;
  table_height: number;
  racket1: racket;
  racket2: racket;
  ball: ball;
  right: number;
  left: number
}

const width = 800;
const height = 400;
const racket_width = 10;
const racket_height = 100;
const ballSpeed = 7;
const ballR = 15;
const racketSpeedY = 5;
const period = 100;


@WebSocketGateway(8001, { cors: 'http://localhost/game/*' })
export class GameGateway {
 
  private isrunning: boolean = false; // define the interval property
  private interval: NodeJS.Timeout; // define the interval property
  private ballSpeedX = ballSpeed;
  private ballSpeedY = ballSpeed;

  private ball : ball = {x: width/2, y: height/2};
  private rackets : [racket, racket] = [
    {x: 10, y: (height - racket_height)/2},
    {x: width - racket_width - 10, y: (height - racket_height)/2}];

  //initialisation score
  private left : number = 0;
  private right : number = 0;
  private winner: string = '';
  private leave: string = '';

  //all connected
  private connectedClients: Socket[] = [];
  //two players
  private players: Socket[] = [];

  @WebSocketServer() server: Server;

  //emit game 
  private emit2all(){
    this.server.emit('pong', {
      ball: this.ball,
      racket1: this.rackets[0],
      racket2: this.rackets[1],
      right: this.right,
      left: this.left
    }); 
  }

@SubscribeMessage('move')
onChgEvent(
  @MessageBody() message: string,
  @ConnectedSocket() client: Socket
): void {
  const player = this.players.indexOf(client);
  if(player == -1) return;
console.log(`message ${message} from ${client} (${player})`);
  if (message == 'up') {
    if (this.rackets[player].y > 0) {
      this.rackets[player].y -= racketSpeedY;
    }
    this.emit2all();

  } else if (message == 'down') {
    if (this.rackets[player].y < height - racket_height) {
      this.rackets[player].y += racketSpeedY;
    }
    this.emit2all();
  }
  else if (message == 'start' && !this.isrunning && this.players.length == 2) {
    this.isrunning = true;
    this.run();
  }  
}

private updatePositions(): void
{
  if (this.ball.y > this.rackets[0].y 
    && this.ball.y < this.rackets[0].y + racket_height 
    && this.ball.x - ballR < this.rackets[0].x + racket_width
    && this.ballSpeedX < 0) {
    // left racket reflection
    this.ballSpeedX = -this.ballSpeedX;
    this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
  }
  else if (this.ball.y > this.rackets[1].y 
    && this.ball.y < this.rackets[1].y + racket_height 
    && this.ball.x + ballR > this.rackets[1].x
    && this.ballSpeedX > 0) {
    // right racket reflection
    this.ballSpeedX = -this.ballSpeedX;
    this.ballSpeedY = Math.sign(this.ballSpeedY) * Math.floor((0.3 + 1.1 * Math.random()) * ballSpeed);
  }
  
  // board reflections
  if (this.ball.x < ballR) {
    ++this.right;
console.log('left loss', this.left, this.right);
    this.ball.x = width / 2 - this.ballSpeedX;
    this.ball.y = height / 2 - this.ballSpeedX;
    this.ballSpeedX = ballSpeed;
  } else if (this.ball.x > width - ballR) {
    this.ballSpeedX = -this.ballSpeedX;
    ++this.left;
console.log('right loss', this.left, this.right);
    this.ball.x = width / 2 - this.ballSpeedX;
    this.ball.y = height / 2 - this.ballSpeedX;
    this.ballSpeedX = -ballSpeed;
  } else if (this.ball.y < ballR || this.ball.y > height - ballR) {
    this.ballSpeedY = -this.ballSpeedY;
  }

  this.ball.x += this.ballSpeedX;
  this.ball.y += this.ballSpeedY;
//console.log(this.ballX, this.ballY);
}
    
  private run(){
console.log("run");
    this.interval = setInterval(() => {
      this.updatePositions();
      // Emit the updated positions of the ball and the rocket to all connected clients
      this.emit2all();
      if (this.left >= 10 || this.right >= 10){
console.log('stop game')
        clearInterval(this.interval); 
        this.isrunning = false;
        this.winner = this.left > this.right ? 'player_left' : 'player_right';
        this.server.emit('winner', {winner: this.winner})
        // this.winner = '';
        this.left = 0;
        this.right = 0;
      }
    }, period);
  }

  handleConnection(socket: Socket, ...args: any[]){
    const username = socket.handshake.query.userName as string;
    const socketId = socket.id;
    this.connectedClients = [...this.connectedClients, socket];
    if(this.players.length < 2){
       this.players = [...this.players, socket];
       this.winner = '';
       this.leave = '';
      this.server.emit('winner', {winner: this.winner, leave: this.leave})
    }
console.log(`user ${username} is connected on ${socketId}`);
console.log(`Connection: connectedClients =  ${this.connectedClients} (players =  ${this.players})`);

  // emit initial game settings
    socket.emit('init-pong', {
      table_width: width,
      table_height: height,
      racket_width: racket_width,
      racket_height: racket_height,
      ballR: ballR,
      right: this.right,
      left: this.left
    });
  }

  handleDisconnect(socket: Socket){
    this.connectedClients = this.connectedClients.filter(item => item != socket);
    this.players = this.players.filter(item => item != socket);
    this.leave = 'leave_id';
console.log(`Disconnection: connectedClients =  ${this.connectedClients} (players =  ${this.players})`);
    if(this.players.length == 1 ){
      clearInterval(this.interval);
      this.isrunning = false;
      this.winner = 'player[0]';
      this.server.emit('winner', {winner: this.winner, leave: this.leave})
      // this.leave = '';
      // this.winner = ''
      this.left = 0;
      this.right = 0;
    }
  } 
}

