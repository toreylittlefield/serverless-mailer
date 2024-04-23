import { ENV_VARS } from './helpers/constants.js';
import { validateEnvVars } from './helpers/utils.js';
import { type SendEmailParams, sendEmail } from './services/nodeMailer.js';
import type { Template, TemplateInput, Results } from './helpers/types.js';
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

export type { Template, TemplateInput, Results, SendEmailParams };

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
