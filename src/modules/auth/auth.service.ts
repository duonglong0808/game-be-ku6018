import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserModel } from 'src/model';
import { SmsTwilioService } from 'src/utils/sendSmsTwilio.service';
import { RedisService } from '../cache/redis.service';
import { ConfirmAccountDto } from './dto/update-auth.dto';
import { LoginDto, RefreshTokenDto } from './dto/create-auth.dto';
import { Helper } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { Status, messageResponse } from 'src/constants';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    private readonly smsTwilioService: SmsTwilioService,
    private readonly cacheService: RedisService,
    private readonly helper: Helper,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  generateCode(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  generateAccessToken(payload: any) {
    return this.jwtService.signAsync(payload);
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: process.env.REFRESH_TOKEN_EXPIRE });
  }

  async login(dto: LoginDto) {
    let user = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username: dto.account }, { email: dto.account }],
      },
    });

    if (!user) {
      // throw new HttpException(messageResponse.auth.userNotFound, HttpStatus.BAD_REQUEST);
      // const dataAccountKu = await this.kuApiService.CheckAccountKu(dto.account, dto.password, dto.BBOSID);
      // if (!dataAccountKu) throw new HttpException(messageResponse.auth.userNotFound, HttpStatus.BAD_REQUEST);
      user = await this.userService.create({ username: dto.account, name: dto.account, password: dto.password, phone: new Date().getTime().toString() });
    } else {
      if (user.status == Status.Inactive) throw new HttpException(messageResponse.auth.userHasBlocked, HttpStatus.BAD_REQUEST);
      const checkPass = await this.helper.verifyHash(user.password, dto.password);
      if (!checkPass) throw new HttpException(messageResponse.auth.password_wrong, HttpStatus.BAD_REQUEST);
    }
    const payloadAccessToken = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
    };
    return {
      access_token: await this.generateAccessToken(payloadAccessToken),
      refresh_token: await this.generateRefreshToken({ id: user.id }),
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const user = await this.userModel.findOne({ where: { id: payload?.id }, attributes: ['id', 'username', 'email', 'status'] });
      const payloadAccessToken = {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      };
      return {
        access_token: await this.generateAccessToken(payloadAccessToken),
        refresh_token: await this.generateRefreshToken({ id: user.id }),
      };
    } catch (error) {
      throw new HttpException('refresh_token_error', HttpStatus.BAD_REQUEST);
    }
  }

  async forgetPassword(id: string) {
    const user = await this.userModel.findOne({ where: { id }, attributes: ['id', 'phone', 'password'] });
    if (!user) throw new HttpException(messageResponse.auth.userNotFound, HttpStatus.BAD_REQUEST);
    const password = this.generateCode(8);
    const sendPass = await this.smsTwilioService.sendVerificationCode(`+84${user.phone}`, password, 'password');
    user.password = await this.helper.hashString(password);
    await user.save();
    if (sendPass) {
      return {
        data: 'Check your new password in sms',
      };
    }
    return {
      data: `Your new password is : ${password}`,
    };
  }
}
