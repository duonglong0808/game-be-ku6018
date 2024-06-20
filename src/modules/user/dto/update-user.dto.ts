import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class updateUserPassword {
  @ApiProperty({ name: 'password', description: 'Mât khẩu mới' })
  password: string;
}
