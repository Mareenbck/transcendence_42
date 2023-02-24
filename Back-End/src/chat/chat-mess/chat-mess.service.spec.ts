import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessService } from './chat-mess.service';

describe('ChatMessService', () => {
  let service: ChatMessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatMessService],
    }).compile();

    service = module.get<ChatMessService>(ChatMessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
