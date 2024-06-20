import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

export class ConfirmAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ name: 'code', description: 'Code', required: true })
  code: string;
}
