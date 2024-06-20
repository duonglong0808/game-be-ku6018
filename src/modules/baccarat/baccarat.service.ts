import { Inject, Injectable } from '@nestjs/common';
import { CreateBaccaratDto } from './dto/create-baccarat.dto';
import { UpdateBaccaratDto } from './dto/update-baccarat.dto';
import { GameBaccaratRepositoryInterface } from './interface/baccarat.interface';
import { Pagination } from 'src/middlewares';
import { messageResponse } from 'src/constants';

@Injectable()
export class BaccaratService {
  constructor(
    @Inject('GameBaccaratRepositoryInterface')
    private readonly gameBaccaratRepository: GameBaccaratRepositoryInterface,
  ) {}

  create(dto: CreateBaccaratDto) {
    return this.gameBaccaratRepository.create(dto);
  }

  checkExitByCondition(condition: object): Promise<number> {
    return this.gameBaccaratRepository.count(condition);
  }

  findAll(pagination: Pagination, sort?: string, typeSort?: string) {
    return this.gameBaccaratRepository.findAll({}, { sort, typeSort, ...pagination, projection: ['id', 'name', 'type', 'nameAuthor', 'avtAuthor', 'nationalAuthor', 'idLive', 'idLiveMobile'] });
  }

  findOne(id: number) {
    return this.gameBaccaratRepository.findOneById(id, ['id', 'name', 'type', 'nameAuthor', 'avtAuthor', 'nationalAuthor', 'idLive', 'idLiveMobile']);
  }

  async update(id: number, dto: UpdateBaccaratDto) {
    const update = await this.gameBaccaratRepository.findByIdAndUpdate(id, dto);
    if (!update) throw Error(messageResponse.system.badRequest);
    return update;
  }

  async remove(id: number) {
    const softDelete = await this.gameBaccaratRepository.softDelete(id);
    if (!softDelete) throw Error(messageResponse.system.badRequest);
    return softDelete;
  }
}
