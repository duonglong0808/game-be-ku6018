import { Inject, Injectable } from '@nestjs/common';
import { CreateBaccaratDetailDto } from './dto/create-baccarat-detail.dto';
import { UpdateBaccaratDetailDto, UpdateStatusBaccaratDetailBotDto, UpdateStatusBaccaratDetailDto } from './dto/update-baccarat-detail.dto';
import { BaccaratDetailRepositoryInterface } from './interface/baccarat-detail.interface';
import { BaccaratService } from '../baccarat/baccarat.service';
import { BullQueueService } from '../bull-queue/bullqueue.service';
import { SendMessageWsService } from '../send-message-ws/send-message-ws.service';
import { StatusBaccarat, messageResponse, pointPoker } from 'src/constants';
import { Pagination } from 'src/middlewares';
import { Op } from 'sequelize';
import { formatDateToId } from 'src/utils';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class BaccaratDetailService {
  constructor(
    @Inject('BaccaratDetailRepositoryInterface')
    private readonly baccaratDetailRepository: BaccaratDetailRepositoryInterface,
    private readonly baccaratService: BaccaratService,
    private readonly bullQueueService: BullQueueService,
    private readonly sendMessageWsService: SendMessageWsService,
    private readonly cacheService: RedisService,
  ) {}

  async create(dto: CreateBaccaratDetailDto) {
    if (!dto.dateId || !dto.gameBaccaratId || !dto.mainTransaction) throw new Error(messageResponse.system.missingData);
    const dice = await this.baccaratService.checkExitByCondition({ id: dto.gameBaccaratId });
    if (dice == 0) throw new Error(messageResponse.system.dataInvalid);
    const totalTransaction = dto.transaction ? dto.transaction : await this.baccaratDetailRepository.count({ gameBaccaratId: dto.gameBaccaratId });
    return this.baccaratDetailRepository.create({ ...dto, status: StatusBaccarat.prepare, transaction: totalTransaction + 1 });
  }

  findAllCMS(gameBaccaratId: number, pagination: Pagination, sort?: string, typeSort?: string) {
    const filter: any = {};
    if (gameBaccaratId) filter.gameBaccaratId = gameBaccaratId;
    return this.baccaratDetailRepository.findAll(filter, { sort, typeSort, ...pagination, projection: ['id', 'transaction', 'mainTransaction', 'pokerPlayer', 'pokerBanker', 'status', 'dateId', 'createdAt', 'totalBet', 'totalReward'] });
  }

  async findHistoryNear() {
    const { data: dataHistory } = await this.baccaratDetailRepository.findAll(
      {
        status: StatusBaccarat.end,
        pokerPlayer: { [Op.ne]: null },
      },
      {
        limit: 240,
        sort: 'id',
        typeSort: 'DESC',
        projection: ['id', 'transaction', 'mainTransaction', 'pokerPlayer', 'pokerBanker', 'pointPlayer', 'pointBanker', 'dateId', 'gameBaccaratId', 'id'],
      },
    );
    return {
      dataHistory,
    };
  }

  async getBrief(dateFrom: number, dateTo: number) {
    return this.baccaratDetailRepository.getTotalBetAndReward(dateFrom, dateTo);
  }

  async updateStatusAndAnswersBOT(dto: UpdateStatusBaccaratDetailBotDto) {
    const dateId = +formatDateToId();
    const baccaratDetail = await this.baccaratDetailRepository.findOneByCondition({
      gameBaccaratId: dto.gameBaccaratId,
      mainTransaction: dto.mainTransaction,
      dateId,
    });
    if (baccaratDetail) {
      // console.log('Đã có');
      return this.updateStatus(baccaratDetail.id, { ...dto });
    } else {
      // console.log('tạo mới', dto);
      const totalTransaction = await this.baccaratDetailRepository.count({ gameBaccaratId: dto.gameBaccaratId });
      const createDto = {
        dateId,
        gameBaccaratId: dto.gameBaccaratId,
        mainTransaction: dto.mainTransaction,
        status: StatusBaccarat.prepare,
        transaction: totalTransaction + 1,
      };
      const newDice = await this.baccaratDetailRepository.create(createDto);
      return this.updateStatus(newDice.id);
    }
  }

  getTimeDelayQueueUpdateStatus(status: number, nextStep: boolean) {
    if (nextStep) {
      switch (status) {
        case StatusBaccarat.prepare:
          return false;
        case StatusBaccarat.bet:
          return 17;
        case StatusBaccarat.showPoker:
          return 4.5;
        case StatusBaccarat.check:
          return 4.5;
        case StatusBaccarat.end:
          return 1;
        default:
          return false;
      }
    }
    return false;
  }

  async updateStatus(id: number, dto?: UpdateStatusBaccaratDetailDto) {
    const baccaratDetail = await this.baccaratDetailRepository.findOneById(id, ['id', 'transaction', 'mainTransaction', 'gameBaccaratId', 'status', 'pokerPlayer', 'pokerBanker', 'pointBanker']);
    if (!baccaratDetail) throw new Error(messageResponse.system.idInvalid);
    const key = `${process.env.APP_NAME}:baccarat-detail:${baccaratDetail.gameBaccaratId}:${baccaratDetail.id}:${baccaratDetail.transaction}`;
    const date = new Date().getTime();
    const countDown = 17 * 1000;
    let nextStep = false; //Chuyển trạng thái
    switch (baccaratDetail.status) {
      case StatusBaccarat.prepare:
        baccaratDetail.status = StatusBaccarat.bet;
        nextStep = true;
        await this.cacheService.set(key, `${StatusBaccarat.bet}:${date + countDown}`, 19);
        break;
      case StatusBaccarat.bet:
        baccaratDetail.status = StatusBaccarat.waitOpen;
        nextStep = true;
        await this.cacheService.set(key, StatusBaccarat.waitOpen, 3);
        break;

      case StatusBaccarat.waitOpen:
      case StatusBaccarat.showPoker:
        if (baccaratDetail.pointBanker != null) {
          baccaratDetail.status = StatusBaccarat.check;
          nextStep = true;
        } else {
          baccaratDetail.status = StatusBaccarat.showPoker;

          const totalPointPlayer = dto.pokerPlayer.reduce((pre, player) => (pre += pointPoker[player.split('_')[1].slice(1)]), 0) % 10;
          const totalPointBanker = dto.pokerBanker.reduce((pre, player) => (pre += pointPoker[player.split('_')[1].slice(1)]), 0) % 10;

          // Kiểm tra nếu cả hai bên có đủ 2 lá bài và bất kỳ bên nào có điểm là 8 hoặc 9 (Natural)
          const isNatural = dto.pokerPlayer.length == 2 && dto.pokerBanker.length == 2 && (totalPointPlayer >= 8 || totalPointBanker >= 8);
          // Kiểm tra điều kiện rút bài của Player
          const playerNeedsCard = dto.pokerPlayer.length < 2 || (!isNatural && dto.pokerPlayer.length == 2 && totalPointPlayer <= 5);
          // Kiểm tra điều kiện rút bài của Banker
          const pointCardThreePayer = +dto.pokerPlayer[3]?.split('_')[1].slice(1);
          const bankerNeedsCard = dto.pokerBanker.length < 2 || (!isNatural && dto.pokerBanker.length == 2 && (totalPointBanker <= 2 || (totalPointBanker == 3 && pointCardThreePayer != 8) || (totalPointBanker == 4 && [2, 3, 4, 5, 6, 7].includes(pointCardThreePayer)) || (totalPointBanker == 5 && [4, 5, 6, 7].includes(pointCardThreePayer)) || (totalPointBanker == 6 && [6, 7].includes(pointCardThreePayer))));

          if (
            //
            isNatural ||
            (dto.pokerPlayer.length == 3 && dto.pokerBanker.length == 3) ||
            (!playerNeedsCard && !bankerNeedsCard)
          ) {
            nextStep = true;
            baccaratDetail.pointBanker = totalPointBanker;
            baccaratDetail.pointPlayer = totalPointPlayer;
            await this.cacheService.set(key, StatusBaccarat.check, 20);
            this.bullQueueService.addToQueueCalcPointBaccarat({
              baccaratDetailId: baccaratDetail.id,
              pokerBanker: dto.pokerBanker,
              pokerPlayer: dto.pokerPlayer,
              pointBanker: totalPointBanker,
              pointPlayer: totalPointPlayer,
            });
          }
          baccaratDetail.pokerPlayer = JSON.stringify(dto.pokerPlayer);
          baccaratDetail.pokerBanker = JSON.stringify(dto.pokerBanker);
        }
        break;

      case StatusBaccarat.check:
        await this.cacheService.delete(key);
        baccaratDetail.status = StatusBaccarat.end;
        nextStep = true;
        break;

      default:
        throw new Error(messageResponse.baccaratDetail.transactionIsFinished);
        break;
    }
    await this.sendMessageWsService.updateStatusBaccarat(
      //
      baccaratDetail.gameBaccaratId,
      baccaratDetail.id,
      baccaratDetail.transaction,
      baccaratDetail.mainTransaction,
      baccaratDetail.status == StatusBaccarat.bet ? `${StatusBaccarat.bet}:${date + countDown}` : baccaratDetail.status,
      JSON.parse(baccaratDetail.pokerPlayer ? baccaratDetail.pokerPlayer : '[]')?.join(','),
      JSON.parse(baccaratDetail.pokerBanker ? baccaratDetail.pokerBanker : '[]')?.join(','),
    );
    await baccaratDetail.save();

    // Auto update and create new dice transaction
    const timeDelay = this.getTimeDelayQueueUpdateStatus(baccaratDetail.status, nextStep);
    if (timeDelay) {
      if (baccaratDetail.status == StatusBaccarat.end) {
        const newMainTransaction = `${+baccaratDetail.mainTransaction.split('-')[1] == 65 ? +baccaratDetail.mainTransaction.split('-')[0] + 1 : baccaratDetail.mainTransaction.split('-')[0]}-${+baccaratDetail.mainTransaction.split('-')[1] == 65 ? 1 : +baccaratDetail.mainTransaction.split('-')[1] + 1}`;
        const createDto: CreateBaccaratDetailDto = {
          dateId: +formatDateToId(),
          gameBaccaratId: baccaratDetail.gameBaccaratId,
          mainTransaction: newMainTransaction,
          transaction: baccaratDetail.transaction,
        };
        await this.create(createDto);
      } else {
        this.bullQueueService.addToQueueAutoUpdateStatusBaccarat({ baccaratDetailId: baccaratDetail.id }, timeDelay);
      }
    }

    return baccaratDetail;
  }

  async updateDataBetAndReward(id: number, totalBet: number, totalReward: number) {
    return this.baccaratDetailRepository.findByIdAndUpdate(id, { totalBet, totalReward });
  }

  async remove(id: number) {
    const diceById = await this.baccaratDetailRepository.findOneById(id);
    if (diceById && diceById.status !== StatusBaccarat.prepare) throw Error(messageResponse.baccaratDetail.transactionIsRunning);
    const softDelete = await this.baccaratDetailRepository.softDelete(id);
    if (!softDelete) throw Error(messageResponse.system.badRequest);
    return softDelete;
  }
}
