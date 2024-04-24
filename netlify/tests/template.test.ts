import dotenv from 'dotenv';
dotenv.config();

import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { Template } from '../../src/index.js';
import {
  deleteTemplateById,
  deleteTemplateByName,
  getTemplateById,
  getTemplateByName,
  postTemplate,
  putTemplateById,
  putTemplateByName,
} from './test-utils.js';

const TEST_TEMPLATE_INPUT = {
  name: 'test-name-function',
  template: `
    <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            <h1>Test</h1>
        </body>
    </html>`,
} as const;

let TEST_TEMPLATE_RECORD = {
  ...TEST_TEMPLATE_INPUT,
} as Template;

beforeAll(async () => {
  // delete test data from the database
  await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
});

afterAll(async () => {
  // delete test data from the database
  await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
});

beforeEach(async () => {
  // delete test data from the database
  await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);

  // reset the test data
  TEST_TEMPLATE_RECORD = {
    ...TEST_TEMPLATE_INPUT,
  } as Template;

  // add test data to the database
  await postTemplate(TEST_TEMPLATE_INPUT.name, TEST_TEMPLATE_INPUT.template);

  // get the test data from the database
  const res = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
  const row = res?.rows?.at(0);
  if (!row) {
    throw new Error('Test data not found');
  }

  TEST_TEMPLATE_RECORD = {
    ...row,
  };
});

describe('template', () => {
  test('should create an template', async () => {
    // already tested in beforeEach
    expect(TEST_TEMPLATE_RECORD.id).toBeDefined();
  });

  test('should get an template by name', async () => {
    const res = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    const row = res?.rows?.at(0);
    expect(row?.name).toEqual(TEST_TEMPLATE_INPUT.name);
    expect(row?.template).toEqual(TEST_TEMPLATE_INPUT.template);
  });

  test('should get a template by id', async () => {
    if (!TEST_TEMPLATE_RECORD.id) {
      throw new Error('Test data not found');
    }
    const res = await getTemplateById(TEST_TEMPLATE_RECORD.id.toString());
    const row = res?.rows?.at(0);
    expect(row?.name).toEqual(TEST_TEMPLATE_INPUT.name);
    expect(row?.template).toEqual(TEST_TEMPLATE_INPUT.template);
  });

  test('should delete a template by name', async () => {
    await deleteTemplateByName(TEST_TEMPLATE_INPUT.name);
    const res = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    expect(res?.rows?.length).toEqual(0);
  });

  test('should delete a template by id', async () => {
    if (!TEST_TEMPLATE_RECORD.id) {
      throw new Error('Test data not found');
    }
    await deleteTemplateById(TEST_TEMPLATE_RECORD.id.toString());

    const res = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    expect(res?.rows?.length).toEqual(0);
  });

  test('should update a template by name', async () => {
    const updatedTemplate = 'updated template';
    await putTemplateByName(TEST_TEMPLATE_INPUT.name, updatedTemplate);

    const res = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    const row = res?.rows?.at(0);
    expect(row?.name).toEqual(TEST_TEMPLATE_INPUT.name);
    expect(row?.template).toEqual(updatedTemplate);
  });

  test('should update a template by id', async () => {
    if (!TEST_TEMPLATE_RECORD.id) {
      throw new Error('Test data not found');
    }
    const updatedTemplate = 'updated template';
    await putTemplateById(TEST_TEMPLATE_RECORD.id.toString(), updatedTemplate);

    const res = await getTemplateByName(TEST_TEMPLATE_INPUT.name);
    const row = res?.rows?.at(0);
    expect(row?.name).toEqual(TEST_TEMPLATE_INPUT.name);
    expect(row?.template).toEqual(updatedTemplate);
  });

  test('should not update a template by name if the template does not exist', async () => {
    const updatedTemplate = 'updated template';
    const res = await putTemplateByName('non-existent-template', updatedTemplate);
    expect(res?.rowsAffected).toEqual(0);
  });
});
