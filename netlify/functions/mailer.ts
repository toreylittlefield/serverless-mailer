import type { Handler } from '@netlify/functions';
import { SendEmailParams, sendEmail } from '../../src/index.js';

const validateBody = (body: string | null): (Record<'html', string> & Partial<SendEmailParams>) | undefined => {
  try {
    if (!body) {
      throw new Error('No body provided');
    }
    const json = JSON.parse(body);
    if ('html' in json && typeof json.template === 'string') {
      return json;
    }
  } catch (error) {
    console.error(error);
    console.error('Invalid JSON body');
    return;
  }
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
      // Check if the body has the required fields
      if (!bodyData?.html) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Bad Request' }),
        };
      }
      const res = await sendEmail(bodyData);
      if (res.accepted) {
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
