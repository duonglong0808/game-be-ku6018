import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';
import { Model, ModelStatic, WhereOptions } from 'sequelize';

export abstract class BaseRepositoryAbstract<T extends Model> implements BaseRepositoryInterface<T> {
  protected constructor(private readonly model: ModelStatic<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create({ ...dto });
    return created_data.save() as any;
  }

  async findOneById(id: number, projection?: string[], options?: any): Promise<T | null> {
    const item: any = await this.model.findOne({ where: { id: id } as WhereOptions, attributes: projection, ...options });
    return item?.deletedAt ? null : (item as T);
  }

  async findOneByCondition(condition?: object, projection?: string[]): Promise<T> {
    return await this.model.findOne({
      where: condition as WhereOptions,
      attributes: projection,
    });
  }

  async findAll(condition: WhereOptions<T>, options?: any): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      //
      this.model.count({ where: condition }),
      this.model.findAll({
        //
        where: condition,
        attributes: options?.projection,
        order: [options?.sort ? [options?.sort, options?.typeSort || 'DESC'] : ['id', options?.typeSort || 'DESC']],
        offset: options?.offset,
        limit: options?.limit,
        include: options?.include,
      }),
    ]);

    return {
      pagination: {
        total: count,
        limit: options?.limit,
        page: options?.page,
      },
      data: items,
    };
  }

  updateMany(condition: object, dto: Partial<T>): Promise<any> {
    return this.model.update(dto, {
      where: condition as WhereOptions,
    });
  }

  async findOneAndUpdate(condition: object, dto: Partial<T>): Promise<T | null> {
    // Tìm bản ghi cần cập nhật dựa trên điều kiện
    const item: T | null = await this.findOneByCondition(condition);
    if (!item) {
      return null;
    }
    await item.update(dto);

    return item;
  }

  async findByIdAndUpdate(id: number, dto: Partial<T>): Promise<T> {
    const item: T | null = await this.findOneById(id);
    if (!item) {
      return null;
    }
    await item.update(dto);

    return item;
  }

  async softDelete(id: number): Promise<boolean> {
    const delete_item = await this.findOneById(id);
    if (!delete_item) {
      return false;
    }

    const dto = {
      isDeleted: true,
      deletedAt: new Date(),
    };

    return !!(await delete_item.update(dto));
  }

  async permanentlyDelete(id: number): Promise<boolean> {
    const delete_item = await this.findOneById(id);
    if (!delete_item) {
      return false;
    }

    await delete_item.destroy();
    return true;
  }

  async permanentlyDeleteByCondition(condition: object): Promise<boolean> {
    const delete_item = await this.findOneByCondition(condition);
    if (!delete_item) {
      return false;
    }
    await delete_item.destroy();
    return true;
  }

  //   async insertMany(items: T[]): Promise<T[]> {
  //     return (await this.model.insertMany(items)) as any;
  //   }

  async count(condition?: WhereOptions): Promise<number> {
    return await this.model.count({ where: condition });
  }
}
