import dotenv from 'dotenv';
import { parseBoolean, parseInteger } from './utils.js';
dotenv.config();

export const ENV_VARS = {
  NODE_MAILER_USER: process.env['NODE_MAILER_USER'] as string,
  NODE_MAILER_PASS: process.env['NODE_MAILER_PASS'] as string,
  NODE_MAILER_SERVICE: process.env['NODE_MAILER_SERVICE'] as string,
  NODE_MAILER_PORT: parseInteger(process.env['NODE_MAILER_PORT']) as number,
  NODE_MAILER_SECURE: parseBoolean(process.env['NODE_MAILER_SECURE']) as boolean,
  NODE_MAILER_HOST: process.env['NODE_MAILER_HOST'] as string,
  NODE_MAILER_TO: process.env['NODE_MAILER_TO'] as string,
  NODE_MAILER_FROM: process.env['NODE_MAILER_FROM'] as string,
  NODE_MAILER_SUBJECT: process.env['NODE_MAILER_SUBJECT'] as string,
  NODE_MAILER_SECRET: process.env['NODE_MAILER_SECRET'] as string,
  TURSO_DATABASE_URL: process.env['TURSO_DATABASE_URL'] as string,
  TURSO_AUTH_TOKEN: process.env['TURSO_AUTH_TOKEN'] as string,
} as const;
