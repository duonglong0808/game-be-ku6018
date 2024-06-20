import { ApiProperty } from '@nestjs/swagger';
import { TypeAnswerDice } from 'src/constants';

export class CreateHistoryPlayDto {
  @ApiProperty({ name: 'transaction', description: 'Phiên', type: Number })
  transaction: number;

  @ApiProperty({ name: 'gameDiceId', description: 'Id game', type: Number })
  gameDiceId: number;

  @ApiProperty({ name: 'diceDetailId', description: 'Id phiên', type: Number })
  diceDetailId: number;

  @ApiProperty({ name: 'gameBaccaratId', description: 'Id game', type: Number })
  gameBaccaratId: number;

  @ApiProperty({ name: 'baccaratDetailId', description: 'Id phiên', type: Number })
  baccaratDetailId: number;

  @ApiProperty({ name: 'answer', description: 'Đáp án người dùng chọn', type: Number, example: TypeAnswerDice.p1 })
  answer: number;

  @ApiProperty({ name: 'userId', description: 'Id người chơi', type: Number })
  userId: number;

  @ApiProperty({ name: 'point', description: 'Số điểm đặt', type: Number })
  point: number;

  @ApiProperty({ name: 'game', description: 'Game ', type: String })
  game: string;

  @ApiProperty({ name: 'type', description: 'loại chơi ', type: String })
  type: string;
}
