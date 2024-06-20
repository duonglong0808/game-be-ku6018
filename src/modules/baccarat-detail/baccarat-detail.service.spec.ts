import { Test, TestingModule } from '@nestjs/testing';
import { BaccaratDetailService } from './baccarat-detail.service';

describe('BaccaratDetailService', () => {
  let service: BaccaratDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaccaratDetailService],
    }).compile();

    service = module.get<BaccaratDetailService>(BaccaratDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
