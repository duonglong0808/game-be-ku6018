import { PartialType } from '@nestjs/mapped-types';
import { CreateKu6018Dto } from './create-ku6018.dto';

export class UpdateKu6018Dto extends PartialType(CreateKu6018Dto) {}
