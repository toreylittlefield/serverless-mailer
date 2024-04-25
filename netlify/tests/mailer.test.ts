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
  test('it should filter the "to" field for unintended recipients and send an email to the default address', async () => {
    const res = await sendEmailRequest<SuccessMailerResponse>({
      body: { ...TEST_TEMPLATE_RECORD, to: ['foo', 'foo@bar', 'test@bar.foo'] },
    });
    expect(res.status).toBe(200);
  });

  test('it should ignore the "from" field and send an email from the default address', async () => {
    const res = await sendEmailRequest<SuccessMailerResponse>({
      body: { ...TEST_TEMPLATE_RECORD, from: 'foo@bar' },
    });
    expect(res.status).toBe(200);
  });

  test('it should send an email and expect a 200 status code', async () => {
    const res = await sendEmailRequest<SuccessMailerResponse>({
      body: TEST_TEMPLATE_RECORD,
    });
    expect(res.status).toBe(200);
    const data = res.data.data;
    expect(data.accepted).toHaveLength(1);
    expect(data.rejected).toHaveLength(0);
    expect(data.envelope).toBeDefined();
    expect(data.messageId).toBeDefined();
    expect(data.response.includes('250')).toBe(true);
  });

  test('it should return a 400 status code if the body is missing the html field', async () => {
    const res = await sendEmailRequest<SuccessMailerResponse>({
      body: { subject: 'Test Template' } as any,
    });
    expect(res.status).toBe(400);
  });

  test('it should only accept POST requests', async () => {
    const resGet = await sendEmailRequest<SuccessMailerResponse>({
      method: 'GET',
    });
    expect(resGet.status).toBe(405);

    const resPut = await sendEmailRequest<SuccessMailerResponse>({
      body: TEST_TEMPLATE_RECORD,
      method: 'PUT',
    });
    expect(resPut.status).toBe(405);

    const resDelete = await sendEmailRequest<SuccessMailerResponse>({
      body: TEST_TEMPLATE_RECORD,
      method: 'DELETE',
    });
    expect(resDelete.status).toBe(405);

    const resPatch = await sendEmailRequest<SuccessMailerResponse>({
      body: TEST_TEMPLATE_RECORD,
      method: 'PATCH' as any,
    });
    expect(resPatch.status).toBe(405);
  });
});
