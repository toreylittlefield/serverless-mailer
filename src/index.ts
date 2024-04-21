import { ENV_VARS } from './helpers/constants.js';
import { validateEnvVars } from './helpers/utils.js';
import { sendEmail } from './services/nodeMailer.js';
import {
  getTemplateByName,
  getTemplateById,
  createTemplate,
  putTemplateByName,
  deleteAllTemplates,
  deleteTemplateById,
  deleteTemplateByName,
  putTemplateById,
} from './services/dbClient.js';
// Validate environment variables before running the application
validateEnvVars(ENV_VARS);

export {
  sendEmail,
  getTemplateByName,
  getTemplateById,
  createTemplate,
  putTemplateByName,
  deleteAllTemplates,
  deleteTemplateById,
  deleteTemplateByName,
  putTemplateById,
};
