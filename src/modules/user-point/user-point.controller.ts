import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, Query, UseGuards } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { AddPointToGameDto, MovePointToMainOrGame } from './dto/update-user-point.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, BaseFilter } from 'src/custom-decorator';
import { Public } from '../auth/decorators';
import { AddPointToUserGuard } from '../auth/guards/add-point-user.guard';
import { TypeUpdatePointUser } from 'src/constants';

@ApiTags('User Point')
@Controller('user-point')
export class UserPointController {
  constructor(private readonly userPointService: UserPointService) {}

  @Get('game/:slug')
  @ApiOperationCustom('User Point Slug', 'get', true, true)
  findOne(@Req() req: any, @Param('slug') slug: string) {
    const user = req['user'];
    const userId = user?.id;
    return this.userPointService.findPointMainAndGame(userId, slug);
  }

  @Get()
  @Public()
  @UseGuards(AddPointToUserGuard)
  @ApiOperationCustom('User Point all game', 'get')
  async findPointUser(@Query('username') username: string, @Query('game') game: string) {
    try {
      return await this.userPointService.findPOintByGame(username, game);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('')
  @Public()
  @UseGuards(AddPointToUserGuard)
  @ApiOperationCustom('User Point', 'POST')
  async updatePoint(@Body() dto: AddPointToGameDto) {
    try {
      return await this.userPointService.addPointOrDeductToGameByName(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/')
  @ApiOperationCustom('Move User Point to main', 'POST')
  async MovePointToMainOrGame(@Body() dto: MovePointToMainOrGame) {
    try {
      // Chuyển về tk chính
      if (dto.isToMain) {
        return await this.userPointService.movePointGameToMain(dto);
      }
      return await this.userPointService.movePointMainToGame(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
