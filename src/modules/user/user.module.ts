import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '../cache/redis.service';
import { UserModel } from 'src/model';
import { FirebaseService, Helper } from 'src/utils';
import { SmsTwilioService } from 'src/utils/sendSmsTwilio.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService, FirebaseService, Helper, SmsTwilioService, RedisService],
  exports: [UserService],
})
export class UserModule {}
