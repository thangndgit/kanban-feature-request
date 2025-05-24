import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  name: 'www.domain.com',
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  service: process.env.MAIL_SERVICE,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (to = process.env.MAIL_USER, subject = '', html = '', attachments = []) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: [to, 'support@tapita.io'],
      subject,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Mail sent successfully to ${to}: `, info.response);

    return info;
    //
  } catch (error) {
    console.error('err', error);
    return error;
  }
};

