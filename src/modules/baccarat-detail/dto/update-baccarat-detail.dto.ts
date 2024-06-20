import { PartialType } from '@nestjs/mapped-types';
import { CreateBaccaratDetailDto } from './create-baccarat-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBaccaratDetailDto extends PartialType(CreateBaccaratDetailDto) {}

export class UpdateStatusBaccaratDetailDto {
  @ApiProperty({ name: 'pokerPlayer', type: [String], description: 'Danh sách bài người chơi' })
  pokerPlayer: string[];

  @ApiProperty({ name: 'pokerBanker', type: [String], description: 'Danh sách bài banker' })
  pokerBanker: string[];

  @ApiProperty({ name: 'isStopCard', type: Boolean, description: 'Danh sách bài banker' })
  isStopCard: string[];
}

export class UpdateStatusBaccaratDetailBotDto {
  @ApiProperty({ name: 'pokerPlayer', type: [String], description: 'Danh sách bài người chơi' })
  pokerPlayer: string[];

  @ApiProperty({ name: 'pokerBanker', type: [String], description: 'Danh sách bài banker' })
  pokerBanker: string[];

  @ApiProperty({ name: 'gameBaccaratId', type: Number, description: 'id game' })
  gameBaccaratId: number;

  @ApiProperty({ name: 'transaction', type: Number, description: 'phiên ở trang chính' })
  mainTransaction: number;

  @ApiProperty({ name: 'isStopCard', type: Boolean, description: 'Danh sách bài banker' })
  isStopCard: string[];
}
