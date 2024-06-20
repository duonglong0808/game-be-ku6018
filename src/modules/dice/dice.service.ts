import { Inject, Injectable } from '@nestjs/common';
import { CreateGameDiceDto } from './dto/create-dice.dto';
import { UpdateGameDiceDto } from './dto/update-dice.dto';
import { GameDiceRepositoryInterface } from './interface/dice.interface';
import { messageResponse } from 'src/constants';
import { Pagination } from 'src/middlewares';

@Injectable()
export class DiceService {
  constructor(
    @Inject('GameDiceRepositoryInterface')
    private readonly gameDiceRepository: GameDiceRepositoryInterface,
  ) {}

  create(dto: CreateGameDiceDto) {
    return this.gameDiceRepository.create(dto);
  }

  checkExitByCondition(condition: object): Promise<number> {
    return this.gameDiceRepository.count(condition);
  }

  findAll(pagination: Pagination, sort?: string, typeSort?: string) {
    return this.gameDiceRepository.findAll({}, { sort, typeSort, ...pagination, projection: ['id', 'name', 'type', 'nameAuthor', 'avtAuthor', 'nationalAuthor', 'idLive', 'idLiveMobile', 'idChat'] });
  }

  findOne(id: number) {
    return this.gameDiceRepository.findOneById(id, ['id', 'name', 'type', 'nameAuthor', 'avtAuthor', 'nationalAuthor', 'idLive', 'idChat']);
  }

  async update(id: number, dto: UpdateGameDiceDto) {
    const update = await this.gameDiceRepository.findByIdAndUpdate(id, dto);
    if (!update) throw Error(messageResponse.system.badRequest);
    return update;
  }

  async remove(id: number) {
    const softDelete = await this.gameDiceRepository.softDelete(id);
    if (!softDelete) throw Error(messageResponse.system.badRequest);
    return softDelete;
  }
}
