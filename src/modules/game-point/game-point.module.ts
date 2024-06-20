import { Module } from '@nestjs/common';
import { GamePointService } from './game-point.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GamePointModel } from 'src/model';
import { GamePointRepository } from './repository/game-point.repository';
import { RedisService } from '../cache/redis.service';

@Module({
  imports: [SequelizeModule.forFeature([GamePointModel])],
  providers: [
    GamePointService,
    {
      provide: 'GamePointRepositoryInterface',
      useClass: GamePointRepository,
    },
    RedisService,
  ],
  exports: [
    {
      provide: 'GamePointRepositoryInterface',
      useClass: GamePointRepository,
    },
    GamePointService,
  ],
})
export class GamePointModule {}
