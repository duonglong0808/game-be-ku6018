import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryPlayDiceModel } from 'src/model';
import { HistoryPlayDiceRepositoryInterface } from '../interface/history-play-dice.interface';
import { BaseRepositoryAbstract } from 'src/repositories/base';

@Injectable()
export class HistoryPlayDiceRepository extends BaseRepositoryAbstract<HistoryPlayDiceModel> implements HistoryPlayDiceRepositoryInterface {
  constructor(@InjectModel(HistoryPlayDiceModel) private readonly historyPlayDiceModel: typeof HistoryPlayDiceModel) {
    super(historyPlayDiceModel);
  }
}
