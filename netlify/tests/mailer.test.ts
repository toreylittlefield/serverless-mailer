import { describe, expect, test } from 'vitest';
// NOTE: default port is 9999 from netlify, see the netlify.toml file
const PORT = process.env['PORT'] || 9999;
const url = new URL(`http://localhost:${PORT}`);
const path = '/.netlify/functions/mailer';
url.pathname = path;
const urlStr = url.toString();

describe('mailer', () => {
  test('should send an email', async () => {
    const response = await fetch(urlStr, {
      method: 'POST',
      body: JSON.stringify({
        to: 'test',
        subject: 'test',
        text: 'test',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    expect(body).toEqual({ message: 'You have access!' });
  });
});
