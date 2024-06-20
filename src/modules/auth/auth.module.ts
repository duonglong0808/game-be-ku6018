import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/model';
import { SmsTwilioService } from 'src/utils/sendSmsTwilio.service';
import { RedisService } from '../cache/redis.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Helper } from 'src/utils';
import { JwtStrategy } from './strategies';
import { UserService } from '../user/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SmsTwilioService, RedisService, Helper, JwtStrategy, UserService],
})
export class AuthModule {}
