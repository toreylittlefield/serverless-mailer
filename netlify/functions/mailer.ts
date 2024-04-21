import type { Handler } from '@netlify/functions';
import { getByIdOrName } from '../lib/crud.js';

export const handler: Handler = async (event, _context) => {
  const { httpMethod, headers } = event;

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
    case 'GET':
      return await getByIdOrName(event);
    case 'POST':
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'You have access!' }),
      };
    case 'PUT':
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'You have access!' }),
      };
    case 'DELETE':
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'You have access!' }),
      };
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
  }
};
