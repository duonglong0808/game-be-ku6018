import { UserPointModel } from 'src/model';
import { BaseRepositoryAbstract } from 'src/repositories/base';
import { UserPointRepositoryInterface } from '../interface/user-point.interface';
import { InjectModel } from '@nestjs/sequelize';

export class UserPointRepository extends BaseRepositoryAbstract<UserPointModel> implements UserPointRepositoryInterface {
  constructor(
    @InjectModel(UserPointModel)
    private readonly userPointModel: typeof UserPointModel,
  ) {
    super(userPointModel);
  }
}
