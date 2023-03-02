import { Test, TestingModule } from '@nestjs/testing';
import { Chatroom2Controller } from './chatroom2.controller';
import { Chatroom2Service } from './chatroom2.service';

describe('Chatroom2Controller', () => {
  let controller: Chatroom2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Chatroom2Controller],
      providers: [Chatroom2Service],
    }).compile();

    controller = module.get<Chatroom2Controller>(Chatroom2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
