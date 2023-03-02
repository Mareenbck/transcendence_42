import { Test, TestingModule } from '@nestjs/testing';
import { DirMessController } from './dir-mess.controller';

describe('DirMessController', () => {
  let controller: DirMessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirMessController],
    }).compile();

    controller = module.get<DirMessController>(DirMessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
