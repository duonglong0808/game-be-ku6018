import { ApiProperty } from '@nestjs/swagger';
import { TypeGameDice } from 'src/constants';

export class CreateGameDiceDto {
  @ApiProperty({ name: 'type', type: String, description: 'Type of dice', example: TypeGameDice.Blockchain })
  type: string;

  @ApiProperty({ name: 'name', type: String, description: 'Name of dice', example: 'Dice 1' })
  name: string;

  @ApiProperty({ name: 'nameAuthor', type: String, description: 'người đang live', example: 'Dice 1' })
  nameAuthor: string;

  @ApiProperty({ name: 'avtAuthor', type: String, description: 'ảnh người live', example: 'Dice 1' })
  avtAuthor: string;

  @ApiProperty({ name: 'idLive', type: String, description: 'id live ', example: 'okgd' })
  idLive: string;

  @ApiProperty({ name: 'idChat', type: String, description: 'link chat ', example: 'okgd' })
  idChat: string;

  @ApiProperty({ name: 'nationalAuthor', type: String, description: 'id live ', example: 'okgd' })
  nationalAuthor: string;
}
