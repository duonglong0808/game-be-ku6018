import { Module } from '@nestjs/common';
import { DiceService } from './dice.service';
import { DiceController } from './dice.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameDiceModel } from 'src/model';
import { GameDiceRepository } from './repository/dice.repository';

@Module({
  imports: [SequelizeModule.forFeature([GameDiceModel])],
  controllers: [DiceController],
  providers: [
    DiceService,
    {
      provide: 'GameDiceRepositoryInterface',
      useClass: GameDiceRepository,
    },
  ],
  exports: [
    {
      provide: 'GameDiceRepositoryInterface',
      useClass: GameDiceRepository,
    },
    DiceService,
  ],
})
export class GameDiceModule {}
