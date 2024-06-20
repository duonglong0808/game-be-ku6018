import { ApiProperty } from '@nestjs/swagger';

export class MovePointToGameOtherDto {
  @ApiProperty({ name: 'userId', description: 'Id of the user', type: Number })
  userId: number;

  @ApiProperty({ name: 'gamePointTransfer', description: 'Id of the user', type: Number })
  gamePointTransfer: number;

  @ApiProperty({ name: 'gamePointReceive', description: 'Id of the user', type: Number })
  gamePointReceive: number;

  @ApiProperty({ name: 'points', description: 'Id of the user', type: Number })
  points: number;
}
