import { Test, TestingModule } from '@nestjs/testing';
import { BankController } from './dice.controller';
import { BankService } from './dice.service';

describe('BankController', () => {
  let controller: BankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [BankService],
    }).compile();

    controller = module.get<BankController>(BankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
