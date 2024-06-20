import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMessageWsService {
  constructor(private readonly httpService: HttpService) {}

  updateStatusDice(gameDiceId: number, diceDetailId: number, transaction: number, mainTransaction: number, status: number | string, totalRed: number) {
    try {
      return this.httpService.axiosRef.post(`${process.env.API_WSK}/dice/status`, {
        gameDiceId,
        diceDetailId,
        transaction,
        mainTransaction,
        status,
        totalRed,
      });
    } catch (error) {
      console.log('🛫🛫🛫 ~ file: send-message-ws.service.ts:14 ~ updateStatusDice ~ error:', error);
    }
  }

  updateStatusBaccarat(gameBaccaratId: number, baccaratDetailId: number, transaction: number, mainTransaction: string, status: number | string, pokerPlayer: string, pokerBanker: string) {
    try {
      return this.httpService.axiosRef.post(`${process.env.API_WSK}/baccarat/status`, {
        gameBaccaratId,
        baccaratDetailId,
        transaction,
        mainTransaction,
        status,
        pokerBanker,
        pokerPlayer,
      });
    } catch (error) {
      console.log('🛫🛫🛫 ~ file: send-message-ws.service.ts:14 ~ updateStatusDice ~ error:', error);
    }
  }

  upPointByUser(data: { userId: number; points: number; type: number }[]) {
    console.log('🚀 ~ SendMessageWsService ~ upPointByUser ~ data:', data);
    try {
      return this.httpService.axiosRef.post(`${process.env.API_WSK}/user/point`, {
        data,
      });
    } catch (error) {
      console.log('🛫🛫🛫 ~ file: send-message-ws.service.ts:14 ~ updateStatusDice ~ error:', error);
    }
  }
}
