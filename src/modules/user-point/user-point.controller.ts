import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, Query } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { MovePointToGameOtherDto } from './dto/update-user-point.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, BaseFilter } from 'src/custom-decorator';

@ApiTags('User Point')
@Controller('user-point')
export class UserPointController {
  constructor(private readonly userPointService: UserPointService) {}

  @Get()
  @BaseFilter()
  @ApiOperationCustom('User Point all game', 'get')
  findAll(@Req() req: any) {
    const user = req['user'];
    const userId = user?.id;
    return this.userPointService.findAll(userId);
  }

  @Get('game/:slug')
  @ApiOperationCustom('User Point Slug', 'get', true, true)
  findOne(@Req() req: any, @Param('slug') slug: string) {
    const user = req['user'];
    const userId = user?.id;
    return this.userPointService.findByGame(userId, slug);
  }

  // @Post('')
  // @ApiOperationCustom('User Point', 'POST')
  // async updatePoint(@Req() req: any, @Body() dto: MovePointToGameOtherDto) {
  //   try {
  //     const user = req['user'];
  //     const userId = user?.id;
  //     dto.userId = userId;
  //     return await this.userPointService.updatePoint(dto);
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
