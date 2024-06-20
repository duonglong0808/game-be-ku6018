import { BeforeCount, BeforeFind, BeforeSave, Column, Model, Table } from 'sequelize-typescript';
import { DataType } from 'sequelize-typescript';
import { Status } from 'src/constants';
import { addConditionNotDelete } from '.';

@Table({
  tableName: 'Users',
  timestamps: true,
  indexes: [
    { name: 'username_index', fields: ['username'], unique: true },
    { name: 'phone_index', fields: ['phone'] },
  ],
})
export class UserModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  username: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  phone: string;

  @Column({ type: DataType.STRING, defaultValue: Status.Active })
  status: string;

  @Column({ type: DataType.TEXT })
  avatar: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  confirmAccount: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDeleted: boolean;

  @Column({ type: DataType.DATE })
  deletedAt: Date;

  @BeforeFind
  @BeforeCount
  @BeforeSave
  static async BeforeFindHook(options: any) {
    addConditionNotDelete(options);
  }
}
