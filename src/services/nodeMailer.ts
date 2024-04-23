import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import { ENV_VARS } from '../helpers/constants.js';
import { RemoveOptional } from '../helpers/types.js';

type HTML = RemoveOptional<Pick<SendMailOptions, 'html'>>;
type HTMLString = NonNullable<HTML['html']>;

const replaceSecret = (html: HTMLString, secret: string) => {
  // if buffer or stream convert to string
  return html.toString().replace('{{ SECRET_PLACEHOLDER }}', secret);
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

export type SendEmailParams = SendMailOptions & {
  html: HTMLString;
};

export const sendEmail = async ({ html, ...options }: SendEmailParams) => {
  const info = await transporter.sendMail({
    from: ENV_VARS.NODE_MAILER_FROM, // sender address
    to: ENV_VARS.NODE_MAILER_TO,
    subject: ENV_VARS.NODE_MAILER_SUBJECT,
    text: `Secret: ${ENV_VARS.NODE_MAILER_SECRET}`, // plain text body
    html: replaceSecret(html, ENV_VARS.NODE_MAILER_SECRET), // html body
    ...options,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  return info;
};
