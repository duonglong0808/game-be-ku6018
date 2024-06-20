import { PartialType } from '@nestjs/swagger';
import { CreateHistoryPlayDto } from './create-history-play.dto';

export class UpdateHistoryPlayDto extends PartialType(CreateHistoryPlayDto) {}
