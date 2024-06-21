import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';
import { FirebaseService } from './utils/firebase-service';

import { UserModule } from './modules/user/user.module';
import { RedisService } from './modules/cache/redis.service';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards';
import { UploadModule } from './modules/upload/upload.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { Environment } from './constants';
import { GameDiceModule } from './modules/dice/dice.module';
import { DiceDetailModule } from './modules/dice-detail/dice-detail.module';
import { HistoryPlayModule } from './modules/history-play/history-play.module';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PaginationMiddleware } from './middlewares';
import { BaccaratModule } from './modules/baccarat/baccarat.module';
import { BaccaratDetailModule } from './modules/baccarat-detail/baccarat-detail.module';
import { BullQueueModule } from './modules/bull-queue/bull-queue.module';
import { GamePointModule } from './modules/game-point/game-point.module';
import { UserPointModule } from './modules/user-point/user-point.module';

console.log(__dirname);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`, `.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      expandVariables: true,
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
      }),
    }),
    // Connect to Models
    SequelizeModule.forRoot({
      dialect: process.env.DATABASE_DIALECT as Dialect,
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DBNAME,
      synchronize: process.env.APP_ID == Environment.Development,
      autoLoadModels: true,
      // logging: false,
      retry: {
        max: 5, // Số lần thử lại tối đa
      },
      // Lắng nghe sự kiện khi có lỗi kết nối
      dialectOptions: {
        connectTimeout: 8000, // Thời gian chờ kết nối (30 giây)
      },
      logging: (log) => {
        console.log(log); // Để theo dõi log kết nối trong quá trình phát triển
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    // FireBase
    FirebaseModule.forRoot({
      googleApplicationCredential: {
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY,
        projectId: process.env.PROJECT_ID,
      },
      storageBucket: process.env.STORAGE_BUCKET,
    }),
    UserModule,
    AuthModule,
    UploadModule,
    GameDiceModule,
    DiceDetailModule,
    HistoryPlayModule,
    BaccaratModule,
    BullQueueModule,
    // BullQueueAddQueueModule,
    GamePointModule,
    BaccaratDetailModule,
    UserPointModule,
  ],
  providers: [
    //
    FirebaseService,
    RedisService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  // Add middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
