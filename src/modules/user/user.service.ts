import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Pagination } from 'src/middlewares';
import { UserModel } from 'src/model';
import { Helper } from 'src/utils';
import { CreateUserDto, SendCodeSmsSto } from './dto/create-user.dto';
import { UpdateUserDto, updateUserPassword } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op, where } from 'sequelize';
import { SmsTwilioService } from 'src/utils/sendSmsTwilio.service';
import { messageResponse } from 'src/constants';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly smsTwilioService: SmsTwilioService,
    private readonly helper: Helper,
    private readonly cacheService: RedisService,
  ) {}

  async checkCode(dto: SendCodeSmsSto) {
    if (+dto.phone.split('')[0] == 0) dto.phone = dto.phone.slice(1);
    const keyRedis = `create-account:code:${dto.phone}`;
    const code = await this.cacheService.get(keyRedis);
    return code == dto.code;
  }

  getTotalUser(status: string) {
    const filter: any = {};
    if (status) filter.status = status;
    return this.userModel.count({
      where: filter,
    });
  }

  async sendCodeAndSaveRedis(phoneNumber: string) {
    if (+phoneNumber.split('')[0] == 0) phoneNumber = phoneNumber.slice(1);
    const keyRedis = `create-account:code:${phoneNumber}`;
    const checkSpam = await this.cacheService.get(keyRedis);
    if (checkSpam) throw new HttpException('Do not repeat actions', HttpStatus.FORBIDDEN);
    const code = (Math.random() * 10000).toFixed(0);
    const sendSms = await this.smsTwilioService.sendVerificationCode(`+84${phoneNumber}`, code, '', 120);
    if (sendSms) await this.cacheService.set(keyRedis, code, 120);
    return true;
  }

  async create(dto: CreateUserDto, checkCode?: boolean) {
    dto.username = dto.username.trim().toLowerCase();
    if (+dto.phone.split('')[0] == 0) dto.phone = dto.phone.slice(1);
    // if (checkCode) {
    //   const keyRedis = `create-account:code:${dto.phone}`;
    //   const codeRedis = await this.cacheService.get(keyRedis);
    //   if (codeRedis != dto.code) throw new Error('code_wrong');
    // }
    const checkDuplicate = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: dto.username }, { phone: dto.phone }],
      },
    });
    if (checkDuplicate) throw new HttpException('Account already exists, please try again', HttpStatus.BAD_REQUEST);
    if (!dto.password) throw new HttpException('Password required', HttpStatus.BAD_REQUEST);
    const password = String(dto.password).trim();
    dto.password = await this.helper.hashString(password);
    return this.userModel.create({ ...dto });
  }

  async findAll(pagination: Pagination, search: string, status: string, phone: string, sort?: any) {
    const filter: any = {};
    if (search) filter[Op.or] = [{ username: { [Op.like]: `%${search.trim()}%` } }, { name: { [Op.like]: `%${search.trim()}%` } }];
    if (status) filter.status = status;
    if (phone) filter.phone = { [Op.like]: `%${phone.trim()}%` };
    const promise1 = this.userModel.count({ where: filter });
    const promise2 = this.userModel.findAll({
      //
      where: filter,
      order: [sort ? [sort, 'DESC'] : ['id', 'DESC']],
      offset: pagination.offset,
      limit: pagination.limit,
      attributes: ['id', 'username', 'name', 'phone', 'status', 'typeUser', 'createdAt'],
    });
    const [countDocument, data] = await Promise.all([promise1, promise2]);
    return {
      pagination: { limit: pagination.limit, page: pagination.page, total: countDocument },
      data,
    };
  }

  findOne(id: number) {
    return this, this.userModel.findOne({ where: { id }, attributes: ['id', 'email', 'username', 'name', 'phone', 'status', 'avatar'] });
  }

  checkExist(id: number) {
    return this.userModel.count({ where: { id } });
  }

  async updateUserCms(id: number, dto: updateUserPassword) {
    const checkUser = await this.findOne(id);
    if (!checkUser) throw new Error(messageResponse.system.idInvalid);
    if (dto.password) {
      dto.password = await this.helper.hashString(dto.password);
    }
    return checkUser.update({ password: dto.password });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
