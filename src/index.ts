import { ENV_VARS } from './helpers/constants.js';
import { validateEnvVars } from './helpers/utils.js';

// Validate environment variables before running the application
validateEnvVars(ENV_VARS);
