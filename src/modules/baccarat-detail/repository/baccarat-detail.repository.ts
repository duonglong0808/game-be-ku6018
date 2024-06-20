import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaccaratDetailsModel } from 'src/model';
import { BaseRepositoryAbstract } from 'src/repositories/base';
import { BaccaratDetailRepositoryInterface } from '../interface/baccarat-detail.interface';
import { Op } from 'sequelize';

@Injectable()
export class BaccaratDetailRepository extends BaseRepositoryAbstract<BaccaratDetailsModel> implements BaccaratDetailRepositoryInterface {
  constructor(@InjectModel(BaccaratDetailsModel) private readonly baccaratDetailsModel: typeof BaccaratDetailsModel) {
    super(BaccaratDetailsModel);
  }

  async getTotalBetAndReward(dateFrom: number, dateTo: number) {
    const totals = await BaccaratDetailsModel.findAll({
      attributes: [
        [BaccaratDetailsModel.sequelize.fn('sum', BaccaratDetailsModel.sequelize.col('totalBet')), 'totalBetSum'],
        [BaccaratDetailsModel.sequelize.fn('sum', BaccaratDetailsModel.sequelize.col('totalReward')), 'totalRewardSum'],
      ],
      where: {
        dateId: {
          [Op.gte]: dateFrom,
          [Op.lte]: dateTo,
        },
        isDeleted: false, // Đảm bảo chỉ lấy các bản ghi không bị xóa
      },
      raw: true, // Lấy kết quả dạng JSON thuần túy
    });

    return totals[0]; // Trả về kết quả đầu tiên
  }
}
