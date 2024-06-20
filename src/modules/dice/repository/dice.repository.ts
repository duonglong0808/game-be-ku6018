import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GameDiceModel } from 'src/model';
import { BaseRepositoryAbstract } from 'src/repositories/base';
import { GameDiceRepositoryInterface } from '../interface/dice.interface';

@Injectable()
export class GameDiceRepository extends BaseRepositoryAbstract<GameDiceModel> implements GameDiceRepositoryInterface {
  constructor(@InjectModel(GameDiceModel) private readonly gameDiceModel: typeof GameDiceModel) {
    super(gameDiceModel);
  }
}
