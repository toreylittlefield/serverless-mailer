import dotenv from 'dotenv';
dotenv.config();

export const ENV_VARS = {
  TURSO_DB_NAME: process.env['TURSO_DB_NAME'],
} as const;

export const validateEnvVars = (envVars: Record<string, string | undefined>) => {
  const missingEnvs = Object.entries(envVars).filter(([_key, value]) => {
    return value === undefined;
  });
  if (missingEnvs.length > 0) {
    throw new Error(`Missing environment variables: ${missingEnvs.map(([key]) => key).join(', ')}`);
  }
};
