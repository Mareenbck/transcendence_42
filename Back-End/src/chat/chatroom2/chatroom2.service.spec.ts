import { Test, TestingModule } from '@nestjs/testing';
import { Chatroom2Service } from './chatroom2.service';

describe('Chatroom2Service', () => {
  let service: Chatroom2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Chatroom2Service],
    }).compile();

    service = module.get<Chatroom2Service>(Chatroom2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
