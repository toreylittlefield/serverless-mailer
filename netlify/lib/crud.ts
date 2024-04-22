import type { HandlerEvent } from '@netlify/functions';
import {
  createTemplate,
  deleteTemplateById,
  deleteTemplateByName,
  getTemplateById,
  getTemplateByName,
  putTemplateById,
  putTemplateByName,
} from '../../src/index.js';

const successResponse = <T>(data: T) => ({
  statusCode: 200,
  body: JSON.stringify(data),
});

const ERRORS = {
  400: 'Bad Request',
  500: 'Internal Server Error',
} as const;
type ErrorKey = keyof typeof ERRORS;
type ErrorMessage = (typeof ERRORS)[ErrorKey];

type ErrorResponse = {
  statusCode: ErrorKey;
};

const errorResponse = ({ statusCode }: ErrorResponse) => {
  const message = ERRORS[statusCode] as ErrorMessage;
  return {
    statusCode,
    body: JSON.stringify({ message }),
  };
};

const getByIdOrName = async (event: HandlerEvent) => {
  try {
    const { queryStringParameters } = event;
    const { id, name } = queryStringParameters || {};
    if (id) {
      const parsedId = parseInt(id, 10);
      return successResponse(await getTemplateById(parsedId));
    } else if (name) {
      return successResponse(await getTemplateByName(name));
    }
    throw new Error('Invalid query parameters');
  } catch (error) {
    console.error(error);
    return errorResponse({ statusCode: 500 });
  }
};

const putByIdOrName = async (event: HandlerEvent) => {
  try {
    const { body } = event;
    if (!body) throw new Error('No body');

    const { id, name, template } = JSON.parse(body);
    if (id) {
      const parsedId = parseInt(id, 10);
      return successResponse(await putTemplateById(parsedId, template));
    } else if (name) {
      return successResponse(await putTemplateByName(name, template));
    }
    throw new Error('Invalid body in PUT request');
  } catch (error) {
    console.error(error);
    return errorResponse({ statusCode: 500 });
  }
};

const deleteByIdOrName = async (event: HandlerEvent) => {
  try {
    const { queryStringParameters } = event;
    const { id, name } = queryStringParameters || {};
    if (id) {
      const parsedId = parseInt(id, 10);
      return successResponse(await deleteTemplateById(parsedId));
    } else if (name) {
      return successResponse(await deleteTemplateByName(name));
    }
    throw new Error('Invalid query parameters in DELETE request');
  } catch (error) {
    console.error(error);
    return errorResponse({ statusCode: 500 });
  }
};

const postCreateTemplate = async (event: HandlerEvent) => {
  try {
    const { body } = event;
    if (!body) throw new Error('No body');

    const { name, template } = JSON.parse(body);
    return successResponse(await createTemplate(name, template));
  } catch (error) {
    console.error(error);
    return errorResponse({ statusCode: 500 });
  }
};

export { deleteByIdOrName, getByIdOrName, postCreateTemplate, putByIdOrName };
