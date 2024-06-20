import { Test, TestingModule } from '@nestjs/testing';
import { BaccaratDetailController } from './baccarat-detail.controller';
import { BaccaratDetailService } from './baccarat-detail.service';

describe('BaccaratDetailController', () => {
  let controller: BaccaratDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaccaratDetailController],
      providers: [BaccaratDetailService],
    }).compile();

    controller = module.get<BaccaratDetailController>(BaccaratDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
