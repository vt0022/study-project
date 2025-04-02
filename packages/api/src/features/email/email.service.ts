import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, code: string) {
    await this.mailService.sendMail({
      to: to,
      subject: subject,
      template:
        template == 'register'
          ? './register.template.hbs'
          : './forgot-password.template.hbs',
      context: {
        email: to,
        code: code,
      },
    });
  }
}
