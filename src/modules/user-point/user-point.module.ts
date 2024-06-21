import { Module } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserPointModel } from 'src/model';
import { UserPointRepository } from './repository/user-point.repository';
import { GamePointModule } from '../game-point/game-point.module';
import { RedisModule } from '../cache/redis.module';
import { Ku6018Module } from '../ku6018/ku6018.module';
import { Ku6018Service } from '../ku6018/ku6018.service';
import { UserModule } from '../user/user.module';
import { UserPointController } from './user-point.controller';

@Module({
  imports: [
    //
    Ku6018Module,
    UserModule,
    RedisModule,
    GamePointModule,
    SequelizeModule.forFeature([UserPointModel]),
  ],
  controllers: [UserPointController],
  providers: [
    UserPointService,
    {
      provide: 'UserPointRepositoryInterface',
      useClass: UserPointRepository,
    },
  ],
  exports: [
    {
      provide: 'UserPointRepositoryInterface',
      useClass: UserPointRepository,
    },
  ],
})
export class UserPointModule {}
