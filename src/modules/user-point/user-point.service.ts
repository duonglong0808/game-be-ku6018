import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { DataJobAddPointToUser } from '../bull-queue/dto/interface';
import { AddPointToMainPointDto } from './dto/create-user-point.dto';
import { TypeUpdatePointUser, messageResponse } from 'src/constants';
import { GamePointService } from '../game-point/game-point.service';
import { RedisService } from '../cache/redis.service';
import { GamePointModel } from 'src/model';
import { UserPointRepositoryInterface } from './interface/user-point.interface';
import { AddPointToGameDto, MovePointToMain } from './dto/update-user-point.dto';
import { Ku6018Service } from '../ku6018/ku6018.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UserPointService {
  constructor(
    @Inject('UserPointRepositoryInterface') private userPointRepository: UserPointRepositoryInterface,
    private readonly ku6018Service: Ku6018Service,
    private sequelize: Sequelize,
    private readonly gamePointService: GamePointService,
    private readonly cacheService: RedisService,
    private readonly userService: UserService,
  ) {}

  async deductPointGameByUser(userId: number, gamePointId: number, pointsToDeduct: number): Promise<boolean> {
    try {
      const [result, tag]: any = await this.sequelize.query(`CALL deduct_money_by_user_game(:userIdDeduct, :gamePointIdDeduct, :pointsToDeduct);`, {
        replacements: { userIdDeduct: userId, gamePointIdDeduct: gamePointId, pointsToDeduct: pointsToDeduct },
        type: 'RAW',
      });

      // Nếu kết quả trả về 'success', trả về true, ngược lại trả về false
      return result?.result === 'success';
    } catch (error) {
      console.log('🚀 ~ UserPointService ~ deductPointGameByUser ~ error:', error);
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
    const [game, user] = await Promise.all([this.gamePointService.findOneBySlugAndSaveRedis(slug), this.userService.findOne(userId)]);
    const [gamePoint, mainPoint] = await Promise.all([this.userPointRepository.findOneByCondition({ gamePointId: game.id, userId }, ['points']), this.ku6018Service.GetPointMain(user.username)]);
    return {
      gamePoint: gamePoint || 0,
      mainPoint: mainPoint?.data || 0,
    };
  }

  async addPointToUser(dto: { userId: number; gamePointId: number; points: number; type: number }) {
    try {
      const [result, tag]: any = await this.sequelize.query(`CALL add_money_by_user_game(:p_userId, :p_gamePointId, :p_points);`, {
        replacements: { p_userId: dto.userId, p_gamePointId: dto.gamePointId, p_points: dto.points },
        type: 'RAW',
      });

      // Nếu kết quả trả về 'success', trả về true, ngược lại trả về false
      return result?.result === 'success';
    } catch (error) {
      console.log('🚀 ~ UserPointService ~ deductPointGameByUser ~ error:', error);
      // Nếu có lỗi xảy ra, trả về false
      return false;
    }
  }

  async addPointOrDeductToGameByName(dto: AddPointToGameDto) {
    if (!(dto.type >= 0) || !(dto.points > 0) || !dto.username || !dto.game) throw new Error(messageResponse.system.missingData);
    const [game, user] = await Promise.all([this.gamePointService.findOneBySlugAndSaveRedis(dto.game), this.userService.findOneByUsername(dto.username)]);
    if (game) {
      const gameId = game.id;
      if (dto.type == TypeUpdatePointUser.down) {
        return this.deductPointGameByUser(user.id, gameId, dto.points);
      } else if (dto.type == TypeUpdatePointUser.up) {
        return this.addPointToUser({
          gamePointId: gameId,
          points: dto.points,
          type: 1,
          userId: user.id,
        });
      }
    }
    throw new Error('game_not_found');
  }

  async movePointGameToMain(dto: MovePointToMain) {
    if (!(dto.points > 0) || !dto.username || !dto.game) throw new Error(messageResponse.system.missingData);
    const [game, user] = await Promise.all([this.gamePointService.findOneBySlugAndSaveRedis(dto.game), this.userService.findOneByUsername(dto.username)]);
    if (game && user) {
      const gameId = game.id;
      const deductPoint = await this.deductPointGameByUser(user.id, gameId, dto.points);
      if (deductPoint) {
        const moveToMain = await this.ku6018Service.TransferPointToMain(dto.username, dto.points);
        if (moveToMain.status) {
          return moveToMain.message;
        }
        throw new Error(moveToMain.message);
      } else {
        throw new Error(messageResponse.userPoint.accountNotHaveEnoughPoints);
      }
    }
    throw new Error('game_or_user_not_found');
  }
}
