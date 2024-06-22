import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDiceDetailDto } from './dto/create-dice-detail.dto';
import { UpdateGameDiceDetailDto, UpdateStatusDiceDetailBotDto, UpdateStatusDiceDetailDto } from './dto/update-dice-detail.dto';
import { DiceDetailRepositoryInterface } from './interface/dice-detail.interface';
import { StatusDiceDetail, messageResponse } from 'src/constants';
import { Pagination } from 'src/middlewares';
import { DiceService } from '../dice/dice.service';
import { RedisService } from '../cache/redis.service';
import { BullQueueService } from '../bull-queue/bullqueue.service';
import { SendMessageWsService } from '../send-message-ws/send-message-ws.service';
import { formatDateToId } from 'src/utils';
import { Op } from 'sequelize';

@Injectable()
export class DiceDetailService {
  constructor(
    @Inject('DiceDetailRepositoryInterface')
    private readonly diceDetailRepository: DiceDetailRepositoryInterface,
    private readonly diceService: DiceService,
    private readonly cacheService: RedisService,
    private readonly bullQueueService: BullQueueService,
    private readonly sendMessageWsService: SendMessageWsService,
  ) {}

  async create(dto: CreateGameDiceDetailDto) {
    if (!dto.dateId || !dto.gameDiceId || !dto.mainTransaction) throw new Error(messageResponse.system.missingData);
    if (dto.totalRed) {
      if (dto.totalRed > 4 || dto.totalRed <= 0) throw new Error(messageResponse.system.dataInvalid);
    }
    const dice = await this.diceService.checkExitByCondition({ id: dto.gameDiceId });
    if (dice == 0) throw new Error(messageResponse.system.dataInvalid);
    const totalTransaction = dto.transaction ? dto.transaction : await this.diceDetailRepository.count({ gameDiceId: dto.gameDiceId });
    return this.diceDetailRepository.create({ ...dto, status: StatusDiceDetail.prepare, transaction: totalTransaction + 1 });
  }

  findAllCMS(gameDiceId: number, pagination: Pagination, sort?: string, typeSort?: string) {
    const filter: any = {};
    if (gameDiceId) filter.gameDiceId = gameDiceId;
    return this.diceDetailRepository.findAll(filter, { sort, typeSort, ...pagination, projection: ['id', 'transaction', 'mainTransaction', 'totalRed', 'status', 'dateId', 'createdAt', 'totalBet', 'totalReward'] });
  }

  async findHistoryNear() {
    const { data: dataHistory } = await this.diceDetailRepository.findAll(
      {
        status: StatusDiceDetail.end,
        totalRed: { [Op.ne]: null },
      },
      {
        limit: 240,
        sort: 'id',
        typeSort: 'DESC',
        projection: ['id', 'transaction', 'mainTransaction', 'totalRed', 'status', 'dateId', 'gameDiceId', 'id'],
      },
    );
    // const { data: transactionNow } = await this.diceDetailRepository.findAll({ gameDiceId }, { limit: 1, sort: 'transaction', typeSort: 'DESC' });
    return {
      dataHistory,
      // transactionNow,
    };
  }

  async getBrief(dateFrom: number, dateTo: number) {
    return this.diceDetailRepository.getTotalBetAndReward(dateFrom, dateTo);
  }

  findOne(id: number) {
    return this.diceDetailRepository.findOneById(id, ['id', 'transaction', 'mainTransaction', 'totalRed', 'status', 'dateId', 'createdAt']);
  }

  getTimeDelayQueueUpdateStatus(status: number) {
    switch (status) {
      case StatusDiceDetail.prepare:
        return false;
      case StatusDiceDetail.shake:
        return false;
      case StatusDiceDetail.bet:
        return 14;
      case StatusDiceDetail.waitOpen:
        break;
      case StatusDiceDetail.check:
        return 5;
      case StatusDiceDetail.end:
        return 1;
      default:
        return false;
    }
  }

  async update(id: number, dto: UpdateGameDiceDetailDto, checkDto?: boolean) {
    const diceDetail = await this.findOne(id);
    if (checkDto) {
      if (!diceDetail) throw Error(messageResponse.system.idInvalid);
      if (diceDetail.status >= StatusDiceDetail.check) throw Error(messageResponse.diceDetail.transactionIsRunning);
    }
    const update = await this.diceDetailRepository.findByIdAndUpdate(id, dto);
    if (!update) throw Error(messageResponse.system.badRequest);
    return update;
  }

  async updateStatusAndAnswersBOT(dto: UpdateStatusDiceDetailBotDto) {
    const dateId = +formatDateToId();
    const diceDetail = await this.diceDetailRepository.findOneByCondition({
      gameDiceId: dto.gameDiceId,
      mainTransaction: dto.mainTransaction,
      dateId,
    });
    if (diceDetail) {
      // console.log('Đã có');
      return this.updateStatus(diceDetail.id, { totalRed: dto.totalRed });
    } else {
      // console.log('tạo mới', dto);
      const totalTransaction = await this.diceDetailRepository.count({ gameDiceId: dto.gameDiceId });
      const createDto = {
        dateId,
        gameDiceId: dto.gameDiceId,
        mainTransaction: dto.mainTransaction,
        totalRed: dto.totalRed,
        status: dto.totalRed ? StatusDiceDetail.waitOpen : StatusDiceDetail.shake,
        transaction: totalTransaction + 1,
      };
      const newDice = await this.diceDetailRepository.create(createDto);
      return this.updateStatus(newDice.id);
    }
  }

  async updateStatus(id: number, dto?: UpdateStatusDiceDetailDto) {
    const diceDetail = await this.diceDetailRepository.findOneById(id, ['id', 'transaction', 'mainTransaction', 'gameDiceId', 'totalRed', 'status']);
    if (!diceDetail) throw new Error(messageResponse.system.idInvalid);
    const key = `${process.env.APP_NAME}:dice-detail:${diceDetail.gameDiceId}:${diceDetail.id}:${diceDetail.transaction}`;
    const date = new Date().getTime();
    const countDown = 14 * 1000;
    switch (diceDetail.status) {
      case StatusDiceDetail.prepare:
        diceDetail.status = StatusDiceDetail.shake;
        await this.cacheService.set(key, StatusDiceDetail.shake, 10);
        break;
      case StatusDiceDetail.shake:
        await this.cacheService.set(key, `${StatusDiceDetail.bet}:${date + countDown}`, 15);
        diceDetail.status = StatusDiceDetail.bet;
        break;
      case StatusDiceDetail.bet:
        await this.cacheService.set(key, StatusDiceDetail.waitOpen, 60);
        diceDetail.status = StatusDiceDetail.waitOpen;
        // Delete keys
        const keyPlayer = `dice-play:${diceDetail.gameDiceId}:${diceDetail.transaction}:`;
        const keys = await this.cacheService.scanKey(keyPlayer);
        // console.log('🚀 ~ DiceDetailService ~ updateStatus ~ keyPlayer:', keyPlayer, keys);
        this.cacheService.deleteMany(keys);
        break;
      case StatusDiceDetail.waitOpen:
        await this.cacheService.set(key, StatusDiceDetail.check, 20);
        diceDetail.status = StatusDiceDetail.check;
        if (dto?.totalRed >= 0) diceDetail.totalRed = dto.totalRed;
        this.bullQueueService.addToQueueCalcPointDice({ diceDetailId: diceDetail.id, totalRed: diceDetail.totalRed, transactionId: diceDetail.transaction });
        break;
      case StatusDiceDetail.check:
        await this.cacheService.delete(key);
        diceDetail.status = StatusDiceDetail.end;
        break;

      default:
        throw new Error(messageResponse.diceDetail.transactionIsFinished);
        break;
    }
    await this.sendMessageWsService.updateStatusDice(diceDetail.gameDiceId, diceDetail.id, diceDetail.transaction, diceDetail.mainTransaction, diceDetail.status == StatusDiceDetail.bet ? `${StatusDiceDetail.bet}:${date + countDown}` : diceDetail.status, diceDetail.status >= StatusDiceDetail.check && diceDetail.totalRed);
    await diceDetail.save();

    // Auto update and create new dice transaction
    const timeDelay = this.getTimeDelayQueueUpdateStatus(diceDetail.status);
    console.log('🚀 ~ DiceDetailService ~ updateStatus ~ timeDelay:', timeDelay);
    if (timeDelay) {
      if (diceDetail.status == StatusDiceDetail.end) {
        const createDto: CreateGameDiceDetailDto = {
          dateId: +formatDateToId(),
          gameDiceId: diceDetail.gameDiceId,
          mainTransaction: diceDetail.mainTransaction + 1,
          transaction: diceDetail.transaction,
          totalRed: null,
        };
        const newDiceDetail = await this.create(createDto);
        this.bullQueueService.addToQueueAutoUpdateStatusDice({ diceDetailId: newDiceDetail.id }, 5);
      } else {
        this.bullQueueService.addToQueueAutoUpdateStatusDice({ diceDetailId: diceDetail.id }, timeDelay);
      }
    }

    return diceDetail;
  }

  async updateDataBetAndReward(id: number, totalBet: number, totalReward: number) {
    return this.diceDetailRepository.findByIdAndUpdate(id, { totalBet, totalReward });
  }

  async remove(id: number) {
    const diceById = await this.diceDetailRepository.findOneById(id);
    if (diceById && diceById.status !== StatusDiceDetail.prepare) throw Error(messageResponse.diceDetail.transactionIsRunning);
    const softDelete = await this.diceDetailRepository.softDelete(id);
    if (!softDelete) throw Error(messageResponse.system.badRequest);
    return softDelete;
  }
}
