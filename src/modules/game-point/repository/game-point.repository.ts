import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GamePointModel } from 'src/model';
import { BaseRepositoryAbstract } from 'src/repositories/base';
import { BaseRepositoryInterface } from 'src/repositories/base';

@Injectable()
export class GamePointRepository extends BaseRepositoryAbstract<GamePointModel> implements BaseRepositoryInterface<GamePointModel> {
  constructor(@InjectModel(GamePointModel) private readonly gamePointModel: typeof GamePointModel) {
    super(GamePointModel);
  }
}
