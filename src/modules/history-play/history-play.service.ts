import { Inject, Injectable } from '@nestjs/common';
import { CreateHistoryPlayDto } from './dto/create-history-play.dto';
import { UpdateHistoryPlayDto } from './dto/update-history-play.dto';
import { HistoryPlayDiceRepositoryInterface } from './interface/history-play-dice.interface';
import { RedisService } from '../cache/redis.service';
import { StatusDiceDetail, TypeAnswerDice, messageResponse } from 'src/constants';
import { Pagination } from 'src/middlewares';
import { Op } from 'sequelize';
import { UserPointService } from '../user-point/user-point.service';
import { GamePointService } from '../game-point/game-point.service';
import { HistoryPlayBaccaratRepositoryInterface } from './interface/history-play-baccarat.interface';
import { UserModel } from 'src/model';

@Injectable()
export class HistoryPlayService {
  constructor(
    @Inject('HistoryPlayDiceRepositoryInterface')
    private readonly historyPlayDiceRepository: HistoryPlayDiceRepositoryInterface,
    @Inject('HistoryPlayBaccaratRepositoryInterface')
    private readonly historyPlayBaccaratRepository: HistoryPlayBaccaratRepositoryInterface,
    private readonly cacheService: RedisService,
    private readonly gamePointService: GamePointService,
    private readonly userPointService: UserPointService,
  ) {}

  // Check vị trí ddax choiw
  // {
  // const keyCheckBetPosition = `dice-play:${dto.gameDiceId}:${dto.transaction}:${dto.userId}`;
  //   const dataRedis = await this.cacheService.hget(keyCheckBetPosition);
  //   const dataAnswerUser = Object.keys(dataRedis);
  //   if (dataAnswerUser.includes(String(dto.answer))) throw new Error(messageResponse.historyPlay.positionHasChoice);
  //   // Trường hợp chọn các ô ngoài cl, tx thì chỉ dc chọn 1 ô
  //   const rateHights = [TypeAnswerDice.p1, TypeAnswerDice.p2, TypeAnswerDice.p3, TypeAnswerDice.p8, TypeAnswerDice.p9, TypeAnswerDice.p10];
  //   const answerHightRate = rateHights.includes(dto.answer);
  //   const checkHasHightRate = rateHights.some((r) => dataAnswerUser.includes(String(r)));
  //   if (answerHightRate && checkHasHightRate) {
  //     throw new Error(messageResponse.historyPlay.cannotChooseAnswer);
  //   }
  // }

  async create(dto: CreateHistoryPlayDto) {
    if (dto.point <= 0) throw new Error(messageResponse.system.dataInvalid);
    let keyRunning = '';
    if (dto.game == 'dice') {
      keyRunning = `${process.env.APP_NAME}:dice-detail:${dto.gameDiceId}:${dto.diceDetailId}:${dto.transaction}`;
    } else if (dto.game == 'mc-baccarat') {
      keyRunning = `${process.env.APP_NAME}:baccarat-detail:${dto.gameDiceId}:${dto.diceDetailId}:${dto.transaction}`;
    }
    const statusDice: string = await this.cacheService.get(keyRunning);
    // if (+statusDice?.split(':')[0] != StatusDiceDetail.bet) throw new Error(messageResponse.historyPlay.outsideBettingTime);

    // trừ tiền
    const gamePointId = await this.checkBalanceAndDeductPoint('ku-casino', dto.userId, dto.point);
    if (!gamePointId) throw new Error(messageResponse.historyPlay.accountNotHaveEnoughPoints);
    // // Check các option đã chơi
    // const keyCheckBetPosition = `dice-play:${dto.gameDiceId}:${dto.transaction}`;
    // // Lưu lại lịch sử vừa chơi
    // await Promise.all([
    //   //
    //   this.cacheService.hset(keyCheckBetPosition, String(dto.answer), dto.point),
    //   this.cacheService.sadd(`user-play-dice:${dto.transaction}`, keyCheckBetPosition),
    // ]);
    if (dto.game == 'dice') {
      return this.historyPlayDiceRepository.create({ ...dto, gamePointId, createdAt: new Date() });
    }
    if (dto.game == 'mc-baccarat') {
      return this.historyPlayBaccaratRepository.create({ ...dto, gamePointId, createdAt: new Date() });
    }
  }

  async checkBalanceAndDeductPoint(slug: string, userId: number, points: number): Promise<number> {
    const gamePoint = await this.gamePointService.findOneBySlugAndSaveRedis(slug);
    const deductPoint = await this.userPointService.deductPointGameByUser(userId, gamePoint.id, points);
    if (deductPoint) return gamePoint.id;
    return null;
  }

  findAllByDiceDetailId(diceDetailId: number) {
    return this.historyPlayDiceRepository.findAll(
      { diceDetailId },
      {
        projection: ['id', 'userId', 'gamePointId', 'point', 'answer'],
      },
    );
  }

  findAllByBaccaratDetailId(baccaratDetailId: number) {
    return this.historyPlayBaccaratRepository.findAll(
      { baccaratDetailId },
      {
        projection: ['id', 'userId', 'gamePointId', 'point', 'answer', 'type'],
      },
    );
  }

  findAllCms(pagination: Pagination, game: string, diceDetailId: number, gameDiceId: number, baccaratDetailId: number, gameBaccaratId: number, userId: number, dateFrom: Date, dateTo: Date, sort?: string, typeSort?: string) {
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (dateFrom && dateTo)
      filter.dateId = {
        [Op.gte]: dateFrom,
        [Op.lte]: dateTo,
      };

    if (game == 'dice') {
      if (diceDetailId) filter.diceDetailId = diceDetailId;
      if (gameDiceId) filter.gameDiceId = gameDiceId;
      return this.historyPlayDiceRepository.findAll(filter, {
        //
        sort,
        typeSort,
        ...pagination,
        projection: ['id', 'answer', 'point', 'status', 'gameDiceId', 'diceDetailId', 'result'],
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'username'], // Chỉ lấy ra id, username và email từ bảng user
          },
        ],
      });
    }
    if (game == 'mc-baccarat') {
      if (baccaratDetailId) filter.baccaratDetailId = baccaratDetailId;
      if (gameBaccaratId) filter.gameBaccaratId = gameBaccaratId;
      return this.historyPlayBaccaratRepository.findAll(filter, {
        //
        sort,
        typeSort,
        ...pagination,
        projection: ['id', 'answer', 'point', 'status', 'gameBaccaratId', 'baccaratDetailId', 'type', 'result'],
        include: [
          {
            model: UserModel,
            as: 'user',
            attributes: ['id', 'username'], // Chỉ lấy ra id, username và email từ bảng user
          },
        ],
      });
    }

    return null;
  }

  updateStatusByDiceDetailId(diceDetailId: number, status: number) {
    return this.historyPlayDiceRepository.updateMany({ diceDetailId }, { status: status });
  }

  updateResultByDiceDetailId(
    data: {
      type: number;
      historyId: number;
    }[],
  ) {
    return Promise.all(data.map((item) => this.historyPlayDiceRepository.findByIdAndUpdate(item.historyId, { result: item.type })));
  }

  updateStatusByBaccaratDetailId(baccaratDetailId: number, status: number) {
    return this.historyPlayBaccaratRepository.updateMany({ baccaratDetailId }, { status: status });
  }

  updateResultByBaccaratDetailId(
    data: {
      type: number;
      historyId: number;
    }[],
  ) {
    return Promise.all(data.map((item) => this.historyPlayDiceRepository.findByIdAndUpdate(item.historyId, { result: item.type })));
  }

  update(id: number, dto: any) {
    if (dto.game == 'dice') {
      return this.historyPlayDiceRepository.findByIdAndUpdate(id, dto);
    }
    return this.historyPlayBaccaratRepository.findByIdAndUpdate(id, dto);
  }

  remove(id: number) {
    return `This action removes a #${id} historyPlay`;
  }
}
