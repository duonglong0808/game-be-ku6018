import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { DataJobAddPointToUser, DataJobAutoUpdateStatusBaccarat, DataJobAutoUpdateStatusDice, DataJobCalcPointBaccarat, DataJobCalcPointDice } from './dto/interface';

@Injectable()
export class BullQueueService {
  constructor(
    // auto calc points
    @InjectQueue('calc-point-dice') private readonly calcPointDiceQueue: Queue,
    @InjectQueue('calc-point-baccarat') private readonly calcPointBaccaratQueue: Queue,
    @InjectQueue('add-point-to-user') private readonly addPointToUserQueue: Queue,
    @InjectQueue('auto-update-status-dice') private readonly updateStatusDiceQueue: Queue,
    @InjectQueue('auto-update-status-baccarat') private readonly updateStatusBaccaratQueue: Queue,
  ) {}

  async addToQueueCalcPointDice(data: DataJobCalcPointDice): Promise<any> {
    // console.log('🚀 ~ BullQueueService ~ addToQueueCalcPointDice ~ data:', data);
    return this.calcPointDiceQueue.add(data);
  }

  async addToQueueCalcPointBaccarat(data: DataJobCalcPointBaccarat): Promise<any> {
    // console.log('🚀 ~ BullQueueService ~ addToQueueCalcPointDice ~ data:', data);
    return this.calcPointBaccaratQueue.add(data);
  }

  async addToQueueAddPointToUser(data: DataJobAddPointToUser[]): Promise<any> {
    return this.addPointToUserQueue.add(data);
  }

  async addToQueueAutoUpdateStatusDice(data: DataJobAutoUpdateStatusDice, delay: number): Promise<any> {
    console.log('THêm addToQueueAutoUpdateStatusDice', new Date().getTime(), delay, new Date().getTime() + delay * 1000);
    return this.updateStatusDiceQueue.add(data, { delay: delay * 1000 });
  }

  async addToQueueAutoUpdateStatusBaccarat(data: DataJobAutoUpdateStatusBaccarat, delay: number): Promise<any> {
    console.log('THêm addToQueueAutoUpdateStatusBaccarat', new Date().getTime(), delay, new Date().getTime() + delay * 1000);
    return this.updateStatusBaccaratQueue.add(data, { delay: delay * 1000 });
  }
}
