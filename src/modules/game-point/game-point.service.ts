import { Inject, Injectable } from '@nestjs/common';
import { GamePointRepositoryInterface } from './interface/game-point.interface';
import { GamePointModel } from 'src/model';
import { RedisService } from '../cache/redis.service';
import { Pagination } from 'src/middlewares';

@Injectable()
export class GamePointService {
  constructor(
    @Inject('GamePointRepositoryInterface')
    private readonly gamePointRepository: GamePointRepositoryInterface,
    private readonly cacheService: RedisService,
  ) {}

  findAll(pagination: Pagination, sort?: string, typeSort?: string, projection?: string[]) {
    const filter: any = {};
    return this.gamePointRepository.findAll(filter, { ...pagination, sort, typeSort, projection: projection?.length ? projection : ['id', 'name', 'slug', 'desc', 'type', 'group'] });
  }

  async findOneBySlugAndSaveRedis(slug: string): Promise<GamePointModel> {
    const key = `game-point:${slug}`;
    const dataRedis = await this.cacheService.get(key);
    if (!dataRedis) {
      const res = await this.gamePointRepository.findOneByCondition({ slug });
      await this.cacheService.set(key, JSON.stringify(res));
      // await this.cacheService.set(key, res.toJSON());
      return res;
    }
    return JSON.parse(dataRedis);
  }
}
