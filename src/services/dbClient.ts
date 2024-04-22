import type { ResultSet } from '@libsql/client/web';
import { createClient } from '@libsql/client/web';
import { ENV_VARS } from '../helpers/constants.js';
import type { Results, Template } from '../helpers/types.js';

// console.log(`Running in ${ENV_VARS.NODE_ENV} environment`);
console.dir(ENV_VARS);
// TODO: setup a testing environment
const dbClient = createClient({
  // url: ENV_VARS.NODE_ENV === 'test' ? 'http://127.0.0.1:8081' : ENV_VARS.TURSO_DATABASE_URL,
  url: ENV_VARS.TURSO_DATABASE_URL,
  authToken: ENV_VARS.TURSO_AUTH_TOKEN,
});

const mapRowsToColumns = (result: ResultSet): Template[] => {
  const rows = result.rows.map((row) => {
    // row to column mapping
    const columns = Array.from(row).reduce((acc, value, index) => {
      const columnName = result.columns[index] as keyof Template;
      if (columnName) {
        // @ts-expect-error - mapping to Template
        acc[columnName] = value as Template[keyof Template];
      }
      return acc;
    }, {} as Template);

    return columns;
  });

  return rows;
};

const bigIntToNumber = (value: bigint | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  return Number(value);
};

/**
 * Crud operations on dbClient
 */

/**
 * GET template by name
 */
const getTemplateByName = async (name: string): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'SELECT * FROM Templates WHERE name = ?',
    args: [name],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * GET template by id
 */
const getTemplateById = async (id: number): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'SELECT * FROM Templates WHERE id = ?',
    args: [id],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * POST template by name
 */
const createTemplate = async (name: string, template: string): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'INSERT INTO Templates (name, template) VALUES (?, ?)',
    args: [name, template],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * PUT template by name
 */
const putTemplateByName = async (name: string, template: string): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'UPDATE Templates SET template = ? WHERE name = ?',
    args: [template, name],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * PUT template by id
 */
const putTemplateById = async (id: number, template: string): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'UPDATE Templates SET template = ? WHERE id = ?',
    args: [template, id],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * DELETE template by name
 */
const deleteTemplateByName = async (name: string): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates WHERE name = ?',
    args: [name],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * DELETE template by id
 */
const deleteTemplateById = async (id: number): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates WHERE id = ?',
    args: [id],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
};

/**
 * DELETE all templates
 */
const deleteAllTemplates = async (): Promise<Results> => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates',
    args: [],
  });

  return {
    ...result,
    lastInsertRowid: bigIntToNumber(result.lastInsertRowid),
    rows: mapRowsToColumns(result),
  };
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
