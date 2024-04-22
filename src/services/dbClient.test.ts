/**
 * test for crud operations on dbClient
 */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { Template, TemplateInput } from '../helpers/types.js';
import {
  createTemplate,
  deleteTemplateById,
  deleteTemplateByName,
  getTemplateById,
  getTemplateByName,
  putTemplateById,
} from './dbClient.js';

const TEST_TEMPLATE_INPUT = {
  name: 'test-name',
  template: `
    <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <h1>Test</h1>
        </body>
    </html>`,
} as const satisfies TemplateInput;

let TEST_TEMPLATE_RECORD: Partial<Template> = {
  ...TEST_TEMPLATE_INPUT,
};

beforeAll(async () => {
  // delete test data from the database
  await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
});

afterAll(async () => {
  // delete test data from the database
  await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
});

beforeEach(async () => {
  // TODO: clear the test database
  await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
  // add test data to the database
  const result = await createTemplate(TEST_TEMPLATE_INPUT.name, TEST_TEMPLATE_INPUT.template);
  const numberFromBigInt = Number(result.lastInsertRowid);
  const getTemplate = await getTemplateById(numberFromBigInt);
  TEST_TEMPLATE_RECORD = {
    ...TEST_TEMPLATE_RECORD,
    ...getTemplate.rows.at(0),
  };
  console.log('TEST_TEMPLATE_RECORD:', TEST_TEMPLATE_RECORD);
});

afterEach(async () => {});

describe('dbClient', () => {
  test('getTemplateByName', async () => {
    // get template by name
    const result = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    const record = result.rows.at(0);
    expect(record).toStrictEqual(TEST_TEMPLATE_RECORD);
  });

  test('getTemplateById', async () => {
    // get template by id
    if (!TEST_TEMPLATE_RECORD?.id) {
      throw new Error('TEST_TEMPLATE_RECORD.id is not defined');
    }
    const result = await getTemplateById(TEST_TEMPLATE_RECORD?.id);
    const record = result.rows.at(0);
    expect(record).toStrictEqual(TEST_TEMPLATE_RECORD);
  });

  test('createTemplate', async () => {
    // create a new template
    const name = 'new-test-name';
    const template = `
      <html>
          <head>
              <title>New Test</title>
          </head>
          <body>
              <h1>New Test</h1>
          </body>
      </html>`;
    await deleteTemplateByName(name);
    const result = await createTemplate(name, template);
    const numberFromBigInt = Number(result.lastInsertRowid);
    const getTemplate = await getTemplateById(numberFromBigInt);
    const record = getTemplate.rows.at(0);
    // FIXME: don't use the record from the database to get the createdAt, updatedAt
    expect(record).toEqual({
      ...record,
      id: numberFromBigInt,
      name,
      template,
    });

    // clean up
    await deleteTemplateById(numberFromBigInt);
  });

  test('putTemplateById', async () => {
    // update template by id
    if (!TEST_TEMPLATE_RECORD?.id) {
      throw new Error('TEST_TEMPLATE_RECORD.id is not defined');
    }
    const template = `
      <html>
          <head>
              <title>Updated Test</title>
          </head>
          <body>
              <h1>Updated Test</h1>
          </body>
      </html>`;
    await putTemplateById(TEST_TEMPLATE_RECORD.id, template);

    const getTemplate = await getTemplateById(TEST_TEMPLATE_RECORD.id);
    const record = getTemplate.rows.at(0);
    expect(record).toStrictEqual({
      ...TEST_TEMPLATE_RECORD,
      template,
    });
  });

  test('putTemplateByName', async () => {
    if (!TEST_TEMPLATE_RECORD?.id) {
      throw new Error('TEST_TEMPLATE_RECORD.id is not defined');
    }

    // update template by name
    const template = `
      <html>
          <head>
              <title>Updated Test</title>
          </head>
          <body>
              <h1>Updated Test</h1>
          </body>
      </html>`;
    await putTemplateById(TEST_TEMPLATE_RECORD.id, template);

    const getTemplate = await getTemplateById(TEST_TEMPLATE_RECORD.id);
    const record = getTemplate.rows.at(0);
    expect(record).toStrictEqual({
      ...TEST_TEMPLATE_RECORD,
      template,
    });
  });

  test('deleteTemplateByName', async () => {
    // delete template by name
    await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
    const result = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    expect(result.rows.length).toBe(0);
  });

  test('deleteTemplateById', async () => {
    // delete template by id
    if (!TEST_TEMPLATE_RECORD?.id) {
      throw new Error('TEST_TEMPLATE_RECORD.id is not defined');
    }
    await deleteTemplateById(TEST_TEMPLATE_RECORD.id);
    const result = await getTemplateById(TEST_TEMPLATE_RECORD.id);
    expect(result.rows.length).toBe(0);
  });
});
