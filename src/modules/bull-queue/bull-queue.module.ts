import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { BullQueueConsumerServiceAddPointToUser, BullQueueConsumerServiceCalcPointBaccarat, BullQueueConsumerServiceCalcPointDice, BullQueueConsumerServiceUpdateStatusBaccarat, BullQueueConsumerServiceUpdateStatusDice } from './bullqueueConsumer.service';
import { BullQueueService } from './bullqueue.service';
import { HistoryPlayModule } from '../history-play/history-play.module';
import { HistoryPlayService } from '../history-play/history-play.service';
import { UserPointModule } from '../user-point/user-point.module';
import { UserPointService } from '../user-point/user-point.service';
import { RedisService } from '../cache/redis.service';
import { GamePointModule } from '../game-point/game-point.module';
import { SendMessageWsService } from '../send-message-ws/send-message-ws.service';
import { HttpModule } from '@nestjs/axios';
import { DiceDetailModule } from '../dice-detail/dice-detail.module';
import { DiceDetailService } from '../dice-detail/dice-detail.service';
import { BaccaratDetailService } from '../baccarat-detail/baccarat-detail.service';
import { GameDiceModule } from '../dice/dice.module';
import { BaccaratDetailModule } from '../baccarat-detail/baccarat-detail.module';
import { BaccaratModule } from '../baccarat/baccarat.module';

@Module({
  imports: [
    // SequelizeModule.forFeature([HistoryPlayDiceModel]),
    HttpModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        prefix: `{bull-queue}:${process.env.APP_ID}:${process.env.APP_NAME}`,
        createClient: (type) => {
          const opts = type !== 'client' ? { enableReadyCheck: false, maxRetriesPerRequest: null } : {};

          return new Redis({
            host: process.env.HOST_REDIS,
            password: process.env.PASSWORD_REDIS,
            port: Number(process.env.PORT_REDIS),
            ...opts,
          });
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: true,
          removeOnFail: false,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: 'calc-point-dice',
      },
      {
        name: 'calc-point-baccarat',
      },
      {
        name: 'add-point-to-user',
      },
      {
        name: 'auto-update-status-dice',
      },
      {
        name: 'auto-update-status-baccarat',
      },
    ),
    HistoryPlayModule,
    UserPointModule,
    GamePointModule,
    GameDiceModule,
    BaccaratModule,
    forwardRef(() => DiceDetailModule),
    forwardRef(() => BaccaratDetailModule),
  ],
  providers: [
    //
    BullQueueConsumerServiceCalcPointDice,
    BullQueueConsumerServiceAddPointToUser,
    BullQueueConsumerServiceUpdateStatusDice,
    BullQueueConsumerServiceUpdateStatusBaccarat,
    BullQueueConsumerServiceCalcPointBaccarat,
    BullQueueService,
    HistoryPlayService,
    UserPointService,
    RedisService,
    SendMessageWsService,
    DiceDetailService,
    BaccaratDetailService,
  ],
  exports: [BullQueueService],
})
export class BullQueueModule {}
