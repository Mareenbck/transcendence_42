import { Module } from '@nestjs/common';
import { Chatroom2Service } from './chatroom2.service';
import { Chatroom2Controller } from './chatroom2.controller';

@Module({
  controllers: [Chatroom2Controller],
  providers: [Chatroom2Service]
})
export class Chatroom2Module {}
