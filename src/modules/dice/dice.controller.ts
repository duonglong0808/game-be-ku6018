import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { DiceService } from './dice.service';
import { CreateGameDiceDto } from './dto/create-dice.dto';
import { UpdateGameDiceDto } from './dto/update-dice.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom, BaseFilter } from 'src/custom-decorator';

@ApiTags('Dice')
@Controller('dice')
export class DiceController {
  constructor(private readonly diceService: DiceService) {}

  @Post()
  @ApiOperationCustom('Dice', 'POST')
  create(@Body() dto: CreateGameDiceDto) {
    return this.diceService.create(dto);
  }

  @Get()
  @BaseFilter()
  @ApiOperationCustom('Dice', 'get')
  findAll(@Req() req: any, @Query('sort') sort: string, @Query('typeSort') typeSort: string) {
    return this.diceService.findAll(req['pagination'], sort, typeSort);
  }

  @Get(':id')
  @ApiOperationCustom('Dice', 'get', true, true)
  findOne(@Param('id') id: string) {
    return this.diceService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperationCustom('Dice', 'patch')
  update(@Param('id') id: string, @Body() dto: UpdateGameDiceDto) {
    return this.diceService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperationCustom('Dice', 'delete')
  remove(@Param('id') id: string) {
    return this.diceService.remove(+id);
  }
}
