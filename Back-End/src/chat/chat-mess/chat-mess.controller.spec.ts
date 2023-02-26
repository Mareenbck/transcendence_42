import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessController } from './chat-mess.controller';

describe('ChatMessController', () => {
  let controller: ChatMessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessController],
    }).compile();

    controller = module.get<ChatMessController>(ChatMessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
