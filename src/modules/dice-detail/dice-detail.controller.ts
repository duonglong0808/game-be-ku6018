import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { DiceDetailService } from './dice-detail.service';
import { CreateGameDiceDetailDto } from './dto/create-dice-detail.dto';
import { UpdateGameDiceDetailDto, UpdateStatusDiceDetailBotDto, UpdateStatusDiceDetailDto } from './dto/update-dice-detail.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, BaseFilter } from 'src/custom-decorator';
import { Public } from '../auth/decorators';

@ApiTags('Dice Detail')
@Controller('dice-detail')
export class DiceDetailController {
  constructor(private readonly diceDetailService: DiceDetailService) {}

  @Post()
  @Public()
  @ApiOperationCustom('Dice Detail', 'POST')
  async create(@Body() dto: CreateGameDiceDetailDto) {
    try {
      return await this.diceDetailService.create(dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('admin')
  @BaseFilter()
  @ApiQuery({
    name: 'gameDiceId',
    description: 'Id cuar game',
    type: Number,
  })
  @ApiOperationCustom('Dice Detail', 'get')
  findAllByCMS(@Req() req: any, @Query('gameDiceId') gameDiceId: number, @Query('sort') sort: string, @Query('typeSort') typeSort: string) {
    try {
      return this.diceDetailService.findAllCMS(gameDiceId, req['pagination'], sort, typeSort);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('admin/brief')
  @BaseFilter()
  @ApiQuery({
    name: 'dateFrom',
    description: 'thời gian bắt đầu',
    type: Number,
  })
  @ApiQuery({
    name: 'dateTo',
    description: 'thời gian kết thúc',
    type: Number,
  })
  @ApiOperationCustom('Dice Detail brief', 'get')
  findTotalBetAndRewardByCMS(@Query('dateFrom') dateFrom: number, @Query('dateTo') dateTo: number) {
    try {
      return this.diceDetailService.getBrief(dateFrom, dateTo);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('')
  @ApiQuery({
    name: 'gameDiceId',
    description: 'Id cuar game',
    type: Number,
  })
  @ApiOperationCustom('Dice Detail for user', 'get')
  findAll(@Query('gameDiceId') gameDiceId: number) {
    try {
      return this.diceDetailService.findHistoryNear();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperationCustom('Dice Detail', 'get', true, true)
  findOne(@Param('id') id: string) {
    return this.diceDetailService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperationCustom('Dice Detail', 'patch')
  async update(@Param('id') id: string, @Body() dto: UpdateGameDiceDetailDto) {
    try {
      return await this.diceDetailService.update(+id, dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:id/status')
  @ApiOperationCustom('Dice Detail status', 'patch')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDiceDetailDto) {
    try {
      return await this.diceDetailService.updateStatus(+id, dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('bot')
  @Public()
  @ApiOperationCustom('Dice Detail status', 'patch')
  async updateResultBot(@Body() dto: UpdateStatusDiceDetailBotDto) {
    try {
      return await this.diceDetailService.updateStatusAndAnswersBOT(dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperationCustom('Dice Detail', 'delete')
  async remove(@Param('id') id: string) {
    try {
      return await this.diceDetailService.remove(+id);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
