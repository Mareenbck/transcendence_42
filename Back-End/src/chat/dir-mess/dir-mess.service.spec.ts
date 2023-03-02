import { Test, TestingModule } from '@nestjs/testing';
import { DirMessService } from './dir-mess.service';

describe('DirMessService', () => {
  let service: DirMessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirMessService],
    }).compile();

    service = module.get<DirMessService>(DirMessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
