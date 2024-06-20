import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SendCodeSmsSto } from './dto/create-user.dto';
import { updateUserPassword } from './dto/update-user.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, BaseFilter } from 'src/custom-decorator';
import { Public } from '../auth/decorators';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('send-code')
  @Public()
  @ApiOperationCustom('User', 'POST')
  async sendCode(@Body() dto: SendCodeSmsSto) {
    return this.userService.sendCodeAndSaveRedis(dto.phone);
  }

  @Post('check-code')
  @Public()
  @ApiOperationCustom('User', 'POST')
  async checkCode(@Body() dto: SendCodeSmsSto) {
    return this.userService.checkCode(dto);
  }

  @Post()
  @Public()
  @ApiOperationCustom('User', 'POST')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, true);
  }

  @Get()
  @BaseFilter()
  @BaseFilter()
  @ApiQuery({
    name: 'search',
    description: 'User name hoặc email',
  })
  @ApiQuery({
    name: 'status',
    description: 'Trạng thái account',
  })
  @ApiOperationCustom('User', 'Get')
  findAll(@Req() req, @Query('search') search: string, @Query('status') status: string, @Query('phone') phone: string) {
    return this.userService.findAll(req['pagination'], search, status, phone);
  }

  @Get('total')
  @ApiQuery({
    name: 'status',
    description: 'Trạng thái account',
  })
  @ApiOperationCustom('User', 'Get')
  totalUser(@Query('status') status: string) {
    return this.userService.getTotalUser(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: updateUserPassword) {
    return this.userService.updateUserCms(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
