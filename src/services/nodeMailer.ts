import nodemailer from 'nodemailer';
import { ENV_VARS } from '../helpers/constants.js';

const replaceSecret = (html: string, secret: string) => {
  return html.replace('{{ SECRET_PLACEHOLDER }}', secret);
};

const transporter = nodemailer.createTransport({
  service: ENV_VARS.NODE_MAILER_SERVICE,
  host: ENV_VARS.NODE_MAILER_HOST,
  port: ENV_VARS.NODE_MAILER_PORT,
  // Use `true` for port 465, `false` for all other ports
  secure: ENV_VARS.NODE_MAILER_SECURE,
  auth: {
    user: ENV_VARS.NODE_MAILER_USER,
    pass: ENV_VARS.NODE_MAILER_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (htmlTemplate: string) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: ENV_VARS.NODE_MAILER_FROM, // sender address
    to: ENV_VARS.NODE_MAILER_TO,
    subject: ENV_VARS.NODE_MAILER_SUBJECT,
    text: `Secret: ${ENV_VARS.NODE_MAILER_SECRET}`, // plain text body
    html: replaceSecret(htmlTemplate, ENV_VARS.NODE_MAILER_SECRET), // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
