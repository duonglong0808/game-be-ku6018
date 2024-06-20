import { PartialType } from '@nestjs/swagger';
import { CreateGameDiceDto } from './create-dice.dto';

export class UpdateGameDiceDto extends PartialType(CreateGameDiceDto) {}
