import { BeforeCount, BeforeFind, BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { BaccaratDetailsModel, GameBaccaratModel, UserModel, addConditionNotDelete } from '.';
import { StatusHistoryPlayGame, TypeUpdatePointUser } from 'src/constants';

@Table({
  tableName: 'HistoryPlayBaccarats',
  timestamps: false,
  indexes: [
    { name: 'gameBaccaratId_index', fields: ['gameBaccaratId'] },
    { name: 'BaccaratDetailId_index', fields: ['BaccaratDetailId'] },
  ],
})
export class HistoryPlayBaccaratModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column({ type: DataType.INTEGER })
  gamePointId: number;

  @Column({ type: DataType.STRING })
  type: string;

  @Column({ type: DataType.INTEGER })
  answer: number;

  @Column({ type: DataType.INTEGER })
  point: number;

  @Column({ type: DataType.INTEGER, defaultValue: StatusHistoryPlayGame.wait })
  status: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  result: number;

  @ForeignKey(() => GameBaccaratModel)
  @Column
  gameBaccaratId: number;

  @BelongsTo(() => GameBaccaratModel)
  gameBaccarat: GameBaccaratModel;

  @ForeignKey(() => BaccaratDetailsModel)
  @Column
  baccaratDetailId: number;

  @BelongsTo(() => BaccaratDetailsModel)
  baccaratDetail: BaccaratDetailsModel;

  @Column({ type: DataType.DATE })
  createdAt: Date;

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
