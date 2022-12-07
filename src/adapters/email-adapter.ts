import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

@Injectable()
export class EmailAdapter {
  async sendEmail(email: string, message: string, subject: string) {
    // create reusable transporter object using the default SMTP transport
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'frontdeveloperdima@gmail.com', // generated ethereal user
        pass: 'ahfbbawovcvurenr', // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transport.sendMail({
      from: 'Dima <frontdeveloperdima@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
  }
}
