import { Module } from '@nestjs/common';
import { HistoryPlayService } from './history-play.service';
import { HistoryPlayController } from './history-play.controller';
import { HistoryPlayDiceRepository } from './repository/history-play-dice.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '../cache/redis.service';
import { UserPointModule } from '../user-point/user-point.module';
import { UserPointService } from '../user-point/user-point.service';
import { GamePointModule } from '../game-point/game-point.module';
import { GamePointService } from '../game-point/game-point.service';
import { HistoryPlayBaccaratModel, HistoryPlayDiceModel } from 'src/model';
import { HistoryPlayBaccaratRepository } from './repository/history-play-baccarat.repository';
import { Ku6018Module } from '../ku6018/ku6018.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    //

    SequelizeModule.forFeature([HistoryPlayDiceModel, HistoryPlayBaccaratModel]),
    UserModule,
    Ku6018Module,
    UserPointModule,
    GamePointModule,
  ],
  controllers: [HistoryPlayController],
  providers: [
    HistoryPlayService,
    {
      provide: 'HistoryPlayDiceRepositoryInterface',
      useClass: HistoryPlayDiceRepository,
    },
    {
      provide: 'HistoryPlayBaccaratRepositoryInterface',
      useClass: HistoryPlayBaccaratRepository,
    },
    RedisService,
    UserPointService,
    GamePointService,
  ],
  exports: [
    {
      provide: 'HistoryPlayDiceRepositoryInterface',
      useClass: HistoryPlayDiceRepository,
    },
    {
      provide: 'HistoryPlayBaccaratRepositoryInterface',
      useClass: HistoryPlayBaccaratRepository,
    },
  ],
})
export class HistoryPlayModule {}
