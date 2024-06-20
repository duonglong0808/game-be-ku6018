import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMailDto } from './send-mail.entity';

@Injectable()
export class SendMailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(dto: SendMailDto, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: dto.sendTo,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Thông báo quyết định chấm dứt hợp đồng',
      template: './default_sendMail', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        ...dto,
      },
    });
  }
}
