import { PartialType } from '@nestjs/mapped-types';
import { CreateBaccaratDto } from './create-baccarat.dto';

export class UpdateBaccaratDto extends PartialType(CreateBaccaratDto) {}
