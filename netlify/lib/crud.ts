import type { HandlerEvent } from '@netlify/functions';
import { getTemplateById, getTemplateByName } from '../../src/index.js';

const getByIdOrName = async (event: HandlerEvent) => {
  try {
    const { queryStringParameters } = event;
    const { id, name } = queryStringParameters || {};
    if (id) {
      const parsedId = parseInt(id, 10);
      return {
        statusCode: 200,
        body: JSON.stringify(await getTemplateById(parsedId)),
      };
    } else if (name) {
      return {
        statusCode: 200,
        body: JSON.stringify(await getTemplateByName(name)),
      };
    }
    throw new Error('Invalid query parameters');
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export { getByIdOrName };
