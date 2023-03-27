import { Module } from '@nestjs/common';
import { Chatroom2Controller } from './chatroom2.controller';
import { Chatroom2Service } from './chatroom2.service';

@Module({
  controllers: [Chatroom2Controller],
  providers: [Chatroom2Service],
})
export class Chatroom2Module {}
