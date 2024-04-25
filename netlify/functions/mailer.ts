import type { Handler } from '@netlify/functions';
import { SendEmailParams, sendEmail } from '../../src/index.js';
import { ENV_VARS } from '../../src/helpers/constants.js';
import { SendMailOptions } from 'nodemailer';

// NOTE: remove any to field from the body so that emails are not sent to unintended recipients
const receiptAllowList = [ENV_VARS.NODE_MAILER_TO, ENV_VARS.NODE_MAILER_FROM];
console.dir(receiptAllowList);

const allowListFilter = (to: SendMailOptions['to']): string | string[] | undefined => {
  if (Array.isArray(to)) {
    const allowed = to.filter((email) => receiptAllowList.includes(email.toString())).map((email) => email.toString());
    return allowed.length > 0 ? allowed : undefined;
  }
  if (typeof to === 'string') {
    return receiptAllowList.includes(to) ? to : undefined;
  }
};

const deleteKeyIfPresent = <T extends Record<string, unknown>>(key: keyof T, obj: T): void => {
  if (key in obj) {
    delete obj[key];
  }
};

const validateBody = (body: string | null): (Record<'html', string> & Partial<SendEmailParams>) | undefined => {
  try {
    if (!body) {
      throw new Error('No body provided');
    }
    const json = JSON.parse(body);

    if ('html' in json && typeof json.html === 'string') {
      if ('to' in json) {
        // check if 'to' is in the body and apply the allowListFilter
        const allowed = allowListFilter(json.to);
        if (allowed) {
          return { ...json, to: allowed };
        }
      }
      // if not allowed, remove the 'to' field to prevent sending emails to unintended recipients
      deleteKeyIfPresent('to', json);
      // do not allow 'from' field to be modified
      deleteKeyIfPresent('from', json);
      return json;
    }
  } catch (error) {
    console.error(error);
    console.error('Invalid JSON body');
    return;
  }
};

export type SuccessMailerResponse = {
  data: Awaited<ReturnType<typeof sendEmail>>;
};

export const handler: Handler = async (event, _context) => {
  const { body, httpMethod, headers } = event;

  // HEAD requests are used to check if a resource exists and using it here for testing `wait-on-config.js`
  if (httpMethod === 'HEAD') {
    return {
      statusCode: 200,
      body: '',
    };
  }

  const requestKey = headers['x-api-key'];
  const apiKey = process.env['API_KEY'];

  // Check if the API key is set in the environment
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'API Key Not Set' }),
    };
  }

  // Check if the request key is the same as the API key
  if (!requestKey || requestKey !== apiKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'You shall not pass!' }),
    };
  }

  const method = httpMethod.toUpperCase();

  switch (method) {
    case 'POST':
      const bodyData = validateBody(body);
      console.log('bodyData', bodyData);
      // Check if the body has the required fields
      if (!bodyData?.html) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Bad Request' }),
        };
      }
      const res = await sendEmail(bodyData);
      if (res.response.includes('250')) {
        return {
          statusCode: 200,
          body: JSON.stringify({ data: res }),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal Server Error', data: res }),
        };
      }
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
  }
};
