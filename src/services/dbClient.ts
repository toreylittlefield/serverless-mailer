import { createClient } from '@libsql/client';
import { ENV_VARS } from '../helpers/constants.js';

const client = createClient({
  url: ENV_VARS.TURSO_DATABASE_URL,
  authToken: ENV_VARS.TURSO_AUTH_TOKEN,
});

export { client };
