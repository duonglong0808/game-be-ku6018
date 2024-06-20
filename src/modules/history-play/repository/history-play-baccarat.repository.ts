import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryPlayBaccaratModel } from 'src/model';
import { HistoryPlayBaccaratRepositoryInterface } from '../interface/history-play-baccarat.interface';
import { BaseRepositoryAbstract } from 'src/repositories/base';

@Injectable()
export class HistoryPlayBaccaratRepository extends BaseRepositoryAbstract<HistoryPlayBaccaratModel> implements HistoryPlayBaccaratRepositoryInterface {
  constructor(@InjectModel(HistoryPlayBaccaratModel) private readonly historyPlayBaccaratModel: typeof HistoryPlayBaccaratModel) {
    super(historyPlayBaccaratModel);
  }
}
