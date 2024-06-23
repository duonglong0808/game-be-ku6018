import { ApiProperty } from '@nestjs/swagger';

export class AddPointToGameDto {
  @ApiProperty({ name: 'username', description: 'usernameUser', type: String })
  username: string;

  @ApiProperty({ name: 'game', description: 'Game muốn cộng trừ tiền', type: String })
  game: string;

  @ApiProperty({ name: 'points', description: 'Số tiền', type: Number })
  points: number;

  @ApiProperty({ name: 'type', description: 'Cộng hay trừ tiền 0: trừ, 1: cộng', type: Number })
  type: number;
}

export class MovePointToMainOrGame {
  @ApiProperty({ name: 'isToMain', description: 'chuyển tiền đến tk chính hay chuyển về tk game', type: Boolean })
  isToMain: string;

  @ApiProperty({ name: 'username', description: 'usernameUser', type: String })
  username: string;

  @ApiProperty({ name: 'game', description: 'Game trừ tiền', type: String })
  game: string;

  @ApiProperty({ name: 'points', description: 'Số tiền', type: Number })
  points: number;
}
