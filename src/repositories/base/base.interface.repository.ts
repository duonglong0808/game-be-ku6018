import { FindAllResponse } from 'src/types/common.type';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(id: number, projection?: string[], option?: object): Promise<T | null>;

  findOneByCondition(condition?: object, projection?: string[]): Promise<T>;

  findAll(condition: object, options?: object): Promise<FindAllResponse<T>>;

  findOneAndUpdate(condition: object, dto: Partial<T>): Promise<T>;

  findByIdAndUpdate(id: number, dto: Partial<T>): Promise<T>;

  // update(id: number, dto: Partial<T>): Promise<T>;

  softDelete(id: number): Promise<boolean>;

  permanentlyDelete(id: number): Promise<boolean>;

  permanentlyDeleteByCondition(condition: object): Promise<boolean>;

  // insertMany(items: T[]): Promise<T[]>;

  count(condition?: object): Promise<number>;

  updateMany(condition: object, dto: Partial<T>): Promise<T>;
}
