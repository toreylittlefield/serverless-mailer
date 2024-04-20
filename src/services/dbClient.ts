import { createClient } from '@libsql/client';
import { ENV_VARS } from '../helpers/constants.js';

// TODO: setup a testing environment
const dbClient = createClient({
  url: ENV_VARS.NODE_ENV === 'test' ? 'http://127.0.0.1:8081' : 'ENV_VARS.TURSO_DATABASE_URL',
  authToken: ENV_VARS.TURSO_AUTH_TOKEN,
});

/**
 * Crud operations on dbClient
 */

/**
 * GET template by name
 */
const getTemplateByName = async (name: string) => {
  const result = await dbClient.execute({
    sql: 'SELECT * FROM Templates WHERE name = ?',
    args: [name],
  });

  return result;
};

/**
 * GET template by id
 */
const getTemplateById = async (id: number) => {
  const result = await dbClient.execute({
    sql: 'SELECT * FROM Templates WHERE id = ?',
    args: [id],
  });

  return result;
};

/**
 * POST template by name
 */
const createTemplate = async (name: string, template: string) => {
  const result = await dbClient.execute({
    sql: 'INSERT INTO Templates (name, template) VALUES (?, ?)',
    args: [name, template],
  });

  return result;
};

/**
 * PUT template by name
 */
const putTemplateByName = async (name: string, template: string) => {
  const result = await dbClient.execute({
    sql: 'UPDATE Templates SET template = ? WHERE name = ?',
    args: [template, name],
  });

  return result;
};

/**
 * PUT template by id
 */
const putTemplateById = async (id: number, template: string) => {
  const result = await dbClient.execute({
    sql: 'UPDATE Templates SET template = ? WHERE id = ?',
    args: [template, id],
  });

  return result;
};

/**
 * DELETE template by name
 */
const deleteTemplateByName = async (name: string) => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates WHERE name = ?',
    args: [name],
  });

  return result;
};

/**
 * DELETE template by id
 */
const deleteTemplateById = async (id: number) => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates WHERE id = ?',
    args: [id],
  });

  return result;
};

/**
 * DELETE all templates
 */
const deleteAllTemplates = async () => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates',
    args: [],
  });

  return result;
};

export {
  createTemplate,
  deleteAllTemplates,
  deleteTemplateById,
  deleteTemplateByName,
  getTemplateById,
  getTemplateByName,
  putTemplateById,
  putTemplateByName,
};
