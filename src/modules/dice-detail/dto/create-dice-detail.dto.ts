import { ApiProperty } from '@nestjs/swagger';
import { TypeGameDice } from 'src/constants';

export class CreateGameDiceDetailDto {
  @ApiProperty({ name: 'mainTransaction', type: Number, description: 'phiên ở trang chính' })
  mainTransaction: number;

  @ApiProperty({ name: 'transaction', type: Number, description: 'phiên ở trang chính' })
  transaction?: number;

  @ApiProperty({ name: 'dateId', type: Number, description: 'Id duy nhất của ngày' })
  dateId: number;

  @ApiProperty({ name: 'totalRed', type: Number, description: 'Số lượng đỏ' })
  totalRed: number;

  @ApiProperty({ name: 'gameDiceId', type: Number, description: 'id game' })
  gameDiceId: number;
}
