import { BeforeCount, BeforeFind, BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { GamePointModel, UserModel, addConditionNotDelete } from '.';

@Table({
  tableName: 'UserPoints', // Tên của bảng lưu điểm của người chơi
  timestamps: true,
})
export class UserPointModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => UserModel) // Khóa ngoại đến bảng người chơi
  @Column
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => GamePointModel) // Khóa ngoại đến bảng điểm game
  @Column
  gamePointId: number;

  @BelongsTo(() => GamePointModel)
  gamePoint: GamePointModel;

  @Column({ type: DataType.INTEGER })
  points: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted: boolean;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  // Hàm hook trước khi tìm kiếm và đếm
  @BeforeFind
  @BeforeCount
  static async BeforeFindHook(options: any) {
    addConditionNotDelete(options);
  }
}
