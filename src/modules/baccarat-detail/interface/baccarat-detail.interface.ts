import { BaccaratDetailsModel } from 'src/model';
import { BaseRepositoryInterface } from 'src/repositories/base';

export interface BaccaratDetailRepositoryInterface extends BaseRepositoryInterface<BaccaratDetailsModel> {
  getTotalBetAndReward(dateFrom: number, dateTo: number): Promise<any>;
}
