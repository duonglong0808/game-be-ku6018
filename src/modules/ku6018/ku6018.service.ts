import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CodeApiKu6018 } from 'src/constants';

@Injectable()
export class Ku6018Service {
  constructor(private readonly httpService: HttpService) {}

  async TransferPointToMain(username: string, amount: number) {
    try {
      const res = await this.httpService.axiosRef.post(`${process.env.API_KU6018}/api/transferMoneyToMain?token=${process.env.TOKE_API_KU6018}&username=${username}&amount=${amount}`);
      const data = res.data;
      console.log('🚀 ~ UserPointService ~ TransferPointToCasinoOrMain ~ data:', data);
      if (data?.error_code == 0) {
        return {
          status: true,
          message: CodeApiKu6018[0],
        };
      } else {
        return {
          status: false,
          message: CodeApiKu6018[data?.error_code],
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }

  async GetPointMain(username: string) {
    const res = await this.httpService.axiosRef.get(`${process.env.API_KU6018}/api/getMoneyMain?token=${process.env.TOKE_API_KU6018}&username=${username}`);
    return res.data;
  }
}
