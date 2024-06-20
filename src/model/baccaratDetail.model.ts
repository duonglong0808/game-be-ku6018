import { BeforeCount, BeforeFind, BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { GameDiceModel, addConditionNotDelete } from '.';
import { StatusBaccarat } from 'src/constants';

@Table({
  tableName: 'BaccaratDetails',
  timestamps: true,
  indexes: [
    { name: 'gameBaccaratId_index', fields: ['gameBaccaratId'] },
    { name: 'transaction_index', fields: ['transaction'] },
    { name: 'dateId_index', fields: ['dateId'] },
    { name: 'mainTransaction_index', fields: ['mainTransaction'] },
  ],
})
export class BaccaratDetailsModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER })
  transaction: number;

  @Column({ type: DataType.STRING })
  mainTransaction: string;

  @Column({ type: DataType.INTEGER, defaultValue: StatusBaccarat.prepare })
  status?: number;

  @ForeignKey(() => GameDiceModel)
  @Column
  gameBaccaratId: number;

  @BelongsTo(() => GameDiceModel)
  gameDice: GameDiceModel;

  @Column({ type: DataType.INTEGER })
  dateId: number;

  @Column({ type: DataType.STRING, defaultValue: '' })
  pokerPlayer: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  pokerBanker: string;

  @Column({ type: DataType.INTEGER })
  pointPlayer: number;

  @Column({ type: DataType.INTEGER })
  pointBanker: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalBet: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalReward: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted: boolean;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @BeforeFind
  @BeforeCount
  static async BeforeFindHook(options: any) {
    addConditionNotDelete(options);
  }
}
