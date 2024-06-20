import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameBaccaratModel } from 'src/model';
import { BaseRepositoryAbstract } from 'src/repositories/base';
import { GameBaccaratRepositoryInterface } from '../interface/baccarat.interface';

@Injectable()
export class GameBaccaratRepository extends BaseRepositoryAbstract<GameBaccaratModel> implements GameBaccaratRepositoryInterface {
  constructor(@InjectModel(GameBaccaratModel) private readonly gameBaccaratModel: typeof GameBaccaratModel) {
    super(GameBaccaratModel);
  }
}
