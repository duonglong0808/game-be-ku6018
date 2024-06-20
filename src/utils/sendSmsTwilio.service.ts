import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class SmsTwilioService {
  private twilioClient: Twilio.Twilio;

  constructor() {
    this.twilioClient = Twilio(process.env.ACCOUNT_TWILIO, process.env.AUTH_TWILIO);
  }

  async sendVerificationCode(phoneNumber: string, verificationCode: string, type?: string, timeExpires?: number) {
    console.log('🚀 ~ SmsTwilioService ~ sendVerificationCode ~ phoneNumber:', phoneNumber);
    try {
      await this.twilioClient.messages.create({
        body: type === 'password' ? `Your new password is ${verificationCode}` : `Your verification code is: ${verificationCode} Expires in ${timeExpires}s`,
        from: process.env.PHONE_TWILIO,
        to: phoneNumber,
      });
      return true;
    } catch (error) {
      console.log('🚀 ~ file: sendSmsTwilio.service.ts:21 ~ SmsTwilioService ~ sendVerificationCode ~ error:', error);
      throw new HttpException('Send sms failed, please try again or check phone number', HttpStatus.BAD_REQUEST);
    }
  }
}
