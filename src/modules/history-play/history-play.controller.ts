import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, Query } from '@nestjs/common';
import { HistoryPlayService } from './history-play.service';
import { CreateHistoryPlayDto } from './dto/create-history-play.dto';
import { UpdateHistoryPlayDto } from './dto/update-history-play.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';

@ApiTags('History Play')
@Controller('history-play')
export class HistoryPlayController {
  constructor(private readonly historyPlayService: HistoryPlayService) {}

  @Post()
  @ApiOperationCustom('Play dice', 'post')
  async create(@Req() req: any, @Body() dto: CreateHistoryPlayDto) {
    try {
      const user = req['user'];
      dto.userId = user?.id;
      return await this.historyPlayService.create(dto);
    } catch (error) {
      console.log('🚀 ~ HistoryPlayController ~ create ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiQuery({
    name: 'userId',
    type: Number,
  })
  @ApiQuery({
    name: 'gameDiceId',
    type: Number,
  })
  @ApiQuery({
    name: 'diceDetailId',
    type: Number,
  })
  @ApiQuery({
    name: 'dateFrom',
    type: Date,
  })
  @ApiQuery({
    name: 'dateTo',
    type: Date,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
  })
  @ApiQuery({
    name: 'typeSort',
    type: String,
  })
  findAll(@Req() req: any, @Query('userId') userId: number, @Query('game') game: string, @Query('gameDiceId') gameDiceId: number, @Query('diceDetailId') diceDetailId: number, @Query('gameBaccaratId') gameBaccaratId: number, @Query('baccaratDetailId') baccaratDetailId: number, @Query('dateForm') dateForm: Date, @Query('dateTo') dateTo: Date, @Query('sort') sort: string, @Query('typeSort') typeSort: string) {
    return this.historyPlayService.findAllCms(req['pagination'], game, diceDetailId, gameDiceId, baccaratDetailId, gameBaccaratId, userId, dateForm, dateTo, sort, typeSort);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.historyPlayService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyPlayService.remove(+id);
  }
}
