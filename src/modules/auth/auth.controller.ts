import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { CreateAuthDto, LoginDto, RefreshTokenDto } from './dto/create-auth.dto';
import { ConfirmAccountDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperationCustom('Login', 'post')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('userInfo')
  @ApiOperationCustom('Login', 'post')
  userInfo(@Req() req) {
    return this.userService.findOne(req['user'].id);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperationCustom('Refresh token', 'post')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
