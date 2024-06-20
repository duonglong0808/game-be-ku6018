import { ApiProperty } from '@nestjs/swagger';

export class AddPointToMainPointDto {
  @ApiProperty({ name: 'userId', description: 'Id of the user', type: Number })
  userId: number;

  @ApiProperty({ name: 'points', description: 'Id of the game point', type: Number })
  points: number;

  @ApiProperty({ name: 'desc', description: 'THông tin thêm', type: Number })
  description: string;
}
