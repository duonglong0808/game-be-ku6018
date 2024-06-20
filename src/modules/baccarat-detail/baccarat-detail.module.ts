import { Module } from '@nestjs/common';
import { BaccaratDetailService } from './baccarat-detail.service';
import { BaccaratDetailController } from './baccarat-detail.controller';
import { BullQueueModule } from '../bull-queue/bull-queue.module';
import { BaccaratModule } from '../baccarat/baccarat.module';
import { BaccaratDetailRepository } from './repository/baccarat-detail.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { BaccaratDetailsModel } from 'src/model';
import { HttpModule } from '@nestjs/axios';
import { BaccaratService } from '../baccarat/baccarat.service';
import { RedisService } from '../cache/redis.service';
import { SendMessageWsService } from '../send-message-ws/send-message-ws.service';

@Module({
  imports: [
    //
    SequelizeModule.forFeature([BaccaratDetailsModel]),
    BullQueueModule,
    BaccaratModule,
    HttpModule,
  ],
  controllers: [BaccaratDetailController],
  providers: [
    BaccaratDetailService,
    {
      provide: 'BaccaratDetailRepositoryInterface',
      useClass: BaccaratDetailRepository,
    },
    BaccaratService,
    RedisService,
    SendMessageWsService,
  ],
  exports: [
    {
      provide: 'BaccaratDetailRepositoryInterface',
      useClass: BaccaratDetailRepository,
    },
    BaccaratDetailService,
  ],
})
export class BaccaratDetailModule {}
