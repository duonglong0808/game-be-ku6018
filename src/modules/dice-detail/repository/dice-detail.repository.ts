import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DiceDetailModel } from 'src/model';
import { BaseRepositoryAbstract } from 'src/repositories/base';
import { DiceDetailRepositoryInterface } from '../interface/dice-detail.interface';
import { Op } from 'sequelize';

@Injectable()
export class DiceDetailRepository extends BaseRepositoryAbstract<DiceDetailModel> implements DiceDetailRepositoryInterface {
  constructor(@InjectModel(DiceDetailModel) private readonly diceDetailModel: typeof DiceDetailModel) {
    super(diceDetailModel);
  }

  async getTotalBetAndReward(dateFrom: number, dateTo: number) {
    const totals = await DiceDetailModel.findAll({
      attributes: [
        [DiceDetailModel.sequelize.fn('sum', DiceDetailModel.sequelize.col('totalBet')), 'totalBetSum'],
        [DiceDetailModel.sequelize.fn('sum', DiceDetailModel.sequelize.col('totalReward')), 'totalRewardSum'],
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
