import dotenv from 'dotenv';
dotenv.config();

import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { SendEmailParams } from '../../src/index.js';
import type { SuccessMailerResponse } from '../functions/mailer.js';
import { sendEmailRequest } from './test-utils.js';

const TEST_TEMPLATE_INPUT = {
  subject: 'Test Template',
  html: `
    <html>
        <head>
            <title>Test Template</title>
        </head>
        <body>
            <main>
                <h1>Test Template Header</h1>
                <h2>This is an alert</h2>
                <p>
                    Secret: {{ SECRET_PLACEHOLDER }}
                </p>
            <main>
        </body>
    </html>`,
} as const satisfies SendEmailParams;

let TEST_TEMPLATE_RECORD = {
  ...TEST_TEMPLATE_INPUT,
};

beforeAll(async () => {});

afterAll(async () => {});

beforeEach(async () => {});

const DEFAULT_TIMEOUT = 10000 as const satisfies number;

describe('mailer', { timeout: DEFAULT_TIMEOUT }, () => {
  test('it should send an email and receive a 200 status code', async () => {
    const res = await sendEmailRequest<SuccessMailerResponse>({
      body: TEST_TEMPLATE_RECORD,
    });
    expect(res.status).toBe(200);
    const data = res.data.data;
    expect(data.accepted).toHaveLength(1);
  });
});
