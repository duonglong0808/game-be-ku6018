import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, Query } from '@nestjs/common';
import { BaccaratDetailService } from './baccarat-detail.service';
import { CreateBaccaratDetailDto } from './dto/create-baccarat-detail.dto';
import { UpdateBaccaratDetailDto, UpdateStatusBaccaratDetailBotDto, UpdateStatusBaccaratDetailDto } from './dto/update-baccarat-detail.dto';
import { Public } from '../auth/decorators';
import { ApiOperationCustom, BaseFilter } from 'src/custom-decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Baccarat Detail')
@Controller('baccarat-detail')
export class BaccaratDetailController {
  constructor(private readonly baccaratDetailService: BaccaratDetailService) {}

  @Post()
  @Public()
  @ApiOperationCustom('Baccarat Detail', 'POST')
  async create(@Body() dto: CreateBaccaratDetailDto) {
    try {
      return await this.baccaratDetailService.create(dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('admin')
  @BaseFilter()
  @ApiQuery({
    name: 'BaccaratId',
    description: 'Id cuar game',
    type: Number,
  })
  @ApiOperationCustom('Baccarat Detail', 'get')
  findAllByCMS(@Req() req: any, @Query('BaccaratId') BaccaratId: number, @Query('sort') sort: string, @Query('typeSort') typeSort: string) {
    try {
      return this.baccaratDetailService.findAllCMS(BaccaratId, req['pagination'], sort, typeSort);
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
  @ApiOperationCustom('Baccarat Detail brief', 'get')
  findTotalBetAndRewardByCMS(@Query('dateFrom') dateFrom: number, @Query('dateTo') dateTo: number) {
    try {
      return this.baccaratDetailService.getBrief(dateFrom, dateTo);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('')
  @ApiQuery({
    name: 'BaccaratId',
    description: 'Id cuar game',
    type: Number,
  })
  @ApiOperationCustom('Baccarat Detail for user', 'get')
  findAll(@Query('BaccaratId') BaccaratId: number) {
    try {
      return this.baccaratDetailService.findHistoryNear();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('/:id/status')
  @ApiOperationCustom('Baccarat Detail status', 'patch')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusBaccaratDetailDto) {
    try {
      return await this.baccaratDetailService.updateStatus(+id, dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('bot')
  @Public()
  @ApiOperationCustom('Baccarat Detail status', 'patch')
  async updateResultBot(@Body() dto: UpdateStatusBaccaratDetailBotDto) {
    try {
      return await this.baccaratDetailService.updateStatusAndAnswersBOT(dto);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperationCustom('Baccarat Detail', 'delete')
  async remove(@Param('id') id: string) {
    try {
      return await this.baccaratDetailService.remove(+id);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
