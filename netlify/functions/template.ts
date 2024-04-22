import type { Handler } from '@netlify/functions';
import { deleteByIdOrName, getByIdOrName, postCreateTemplate, putByIdOrName } from '../lib/crud.js';
/**
 * function for CRUD operations on a template
 */

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
      return await postCreateTemplate(event);
    case 'PUT':
      return await putByIdOrName(event);
    case 'DELETE':
      return await deleteByIdOrName(event);
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
  }
};
