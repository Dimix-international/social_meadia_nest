import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapters/email-adapter';

@Injectable()
export class EmailsService {
  constructor(protected emailAdapter: EmailAdapter) {}

  async sendEmailConfirmationRegistration(
    email: string,
    activationCode: string,
  ) {
    const message = `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
                <a href='${
                  process.env.API_URL || 'http://localhost:5000/'
                }auth/registration-confirmation?code=${activationCode}'>complete registration</a>
            </p>
        `;
    await this.emailAdapter.sendEmail(email, message, 'Registration');
  }

  async recoveryPassword(email: string, activationCode: string) {
    const message = `
            <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
                <a href='${
                  process.env.API_URL || 'http://localhost:5000/'
                }password-recovery?recoveryCode=${activationCode}'>recovery password</a>
            </p>
        `;
    await this.emailAdapter.sendEmail(email, message, 'Recovery password');
  }
}
