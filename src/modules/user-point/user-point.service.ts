import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DataJobAddPointToUser } from '../bull-queue/dto/interface';
import { AddPointToMainPointDto } from './dto/create-user-point.dto';
import { messageResponse } from 'src/constants';
import { GamePointService } from '../game-point/game-point.service';
import { RedisService } from '../cache/redis.service';
import { GamePointModel } from 'src/model';
import { UserPointRepositoryInterface } from './interface/user-point.interface';

@Injectable()
export class UserPointService {
  constructor(
    @Inject('UserPointRepositoryInterface') private userPointRepository: UserPointRepositoryInterface,
    private sequelize: Sequelize,
    private readonly gamePointService: GamePointService,
    private readonly cacheService: RedisService,
  ) {}

  async deductPointByUser(userId: number, gamePointId: number, pointsToDeduct: number): Promise<boolean> {
    try {
      const [result, tag]: any = await this.sequelize.query(`CALL deduct_money_by_user_game(:userIdDeduct, :gamePointIdDeduct, :pointsToDeduct);`, {
        replacements: { userIdDeduct: userId, gamePointIdDeduct: gamePointId, pointsToDeduct: pointsToDeduct },
        type: 'RAW',
      });

      // Nếu kết quả trả về 'success', trả về true, ngược lại trả về false
      return result?.result === 'success';
    } catch (error) {
      console.log('🚀 ~ UserPointService ~ deductPointByUser ~ error:', error);
      // Nếu có lỗi xảy ra, trả về false
      return false;
    }
  }
  async findAll(userId: string) {
    const keyRedis = `data-game-point`;
    let allGamePoint: GamePointModel[] = null;
    const dataRedis = await this.cacheService.get(keyRedis);
    if (dataRedis) {
      allGamePoint = JSON.parse(dataRedis);
    } else {
      const dataDb = await this.gamePointService.findAll({ limit: 1000, offset: 0, page: 1 }, 'id', 'ASC', ['id', 'slug', 'name']);
      allGamePoint = dataDb.data;
      this.cacheService.set(keyRedis, JSON.stringify(allGamePoint));
    }
    const dataPoint = await Promise.all(allGamePoint.map((item) => this.userPointRepository.findOneByCondition({ gamePointId: item.id, userId }, ['points'])));
    const dataRes = allGamePoint.map((gamePoint, index) => {
      return {
        gamePointId: gamePoint.id,
        gameSlug: gamePoint.slug,
        gameName: gamePoint.name,
        points: dataPoint[index]?.points || 0,
      };
    });
    return dataRes;
  }

  async findByGame(userId: number, slug: string) {
    const { id } = await this.gamePointService.findOneBySlugAndSaveRedis(slug);
    const gamePoint = await this.userPointRepository.findOneByCondition({ gamePointId: id, userId }, ['points']);
    return {
      gamePoint,
    };
  }

  async addPointToUser(dto: DataJobAddPointToUser) {
    try {
      const [result, tag]: any = await this.sequelize.query(`CALL add_money_by_user_game(:p_userId, :p_gamePointId, :p_points);`, {
        replacements: { p_userId: dto.userId, p_gamePointId: dto.gamePointId, p_points: dto.points },
        type: 'RAW',
      });

      // Nếu kết quả trả về 'success', trả về true, ngược lại trả về false
      return result?.result === 'success';
    } catch (error) {
      console.log('🚀 ~ UserPointService ~ deductPointByUser ~ error:', error);
      // Nếu có lỗi xảy ra, trả về false
      return false;
    }
  }
}
