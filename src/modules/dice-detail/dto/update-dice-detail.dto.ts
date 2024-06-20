import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGameDiceDetailDto } from './create-dice-detail.dto';

export class UpdateGameDiceDetailDto extends PartialType(CreateGameDiceDetailDto) {}

export class UpdateStatusDiceDetailDto {
  @ApiProperty({ name: 'totalRed', type: Number, description: 'Số lượng đỏ' })
  totalRed: number;
}

export class UpdateStatusDiceDetailBotDto {
  @ApiProperty({ name: 'totalRed', type: Number, description: 'Số lượng đỏ' })
  totalRed: number;

  @ApiProperty({ name: 'gameDiceId', type: Number, description: 'id game' })
  gameDiceId: number;

  @ApiProperty({ name: 'transaction', type: Number, description: 'phiên ở trang chính' })
  mainTransaction: number;
}
