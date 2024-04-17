/**
 * create a turso database and schema using their CLI
 */

import { execSync } from 'node:child_process';
import { ENV_VARS, validateEnvVars } from './helpers.js';

// validate environment variables
validateEnvVars(ENV_VARS);

// create a new database
const createNewDatabase = () => {
  // specify the path to the dump file
  const PATH_TO_DUMP = './scripts/dump.sql' as const;

  try {
    const buffer = execSync(`turso db create ${ENV_VARS.TURSO_DB_NAME} --from-dump ${PATH_TO_DUMP}`);
    if (buffer.toString().includes('Created database')) {
      console.log('Created database');
      console.log(buffer.toString());
    }
  } catch (error) {
    console.error(error);
  }
};

createNewDatabase();
