import { Module } from '@nestjs/common';
import { Chatroom2Controller } from './chatroom2.controller';

@Module({
  controllers: [Chatroom2Controller],
})
export class Chatroom2Module {}
