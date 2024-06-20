import { Module } from '@nestjs/common';
import { BaccaratService } from './baccarat.service';
import { BaccaratController } from './baccarat.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameBaccaratModel } from 'src/model';
import { GameBaccaratRepository } from './repository/baccarat.repository';

@Module({
  imports: [SequelizeModule.forFeature([GameBaccaratModel])],
  controllers: [BaccaratController],
  providers: [
    BaccaratService,
    {
      provide: 'GameBaccaratRepositoryInterface',
      useClass: GameBaccaratRepository,
    },
  ],
  exports: [
    BaccaratService,
    {
      provide: 'GameBaccaratRepositoryInterface',
      useClass: GameBaccaratRepository,
    },
  ],
})
export class BaccaratModule {}
