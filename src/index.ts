import { ENV_VARS } from './helpers/constants.js';
import { validateEnvVars } from './helpers/utils.js';
import { dbClient } from './services/dbClient.js';

// Validate environment variables before running the application
validateEnvVars(ENV_VARS);

// create the test item
const createTemplate = async () => {
  const result = await dbClient.execute({
    sql: 'INSERT INTO Templates (name, template) VALUES (?, ?)',
    args: ['test-name', 'test-template'],
  });

  console.log(result);
};

const selectTemplate = async () => {
  const result = await dbClient.execute({
    sql: 'SELECT * FROM Templates WHERE name = ?',
    args: ['test-name'],
  });

  console.log(result);
};

const deleteTemplate = async () => {
  const result = await dbClient.execute({
    sql: 'DELETE FROM Templates WHERE name = ?',
    args: ['test-name'],
  });

  console.log(result);
};
deleteTemplate().then(() => {
  createTemplate().then(() => {
    selectTemplate().then(() => {
      console.log('done');
    });
  });
});
