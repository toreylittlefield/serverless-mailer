export const validateEnvVars = <T extends Record<string, unknown>>(envVars: T) => {
  // check if all the environment variables are defined in the .env file
  const missingVariables = Object.entries(envVars)
    .filter(([_, value]) => value === undefined)
    .map(([key]) => key);

  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }

  // TODO: check if the environment variables have the correct type
};

export const parseInteger = (value: string | undefined): number | undefined => {
  const error = new Error(`Invalid integer value: ${value}`);
  try {
    if (typeof value === 'string') {
      const int = parseInt(value, 10);
      if (Number.isInteger(int)) {
        return int;
      } else {
        throw error;
      }
    }

    if (typeof value === 'number' && Number.isInteger(value)) {
      return parseInt(value, 10);
    }
  } catch (error) {
    throw error;
  }
};

export const parseBoolean = (value: string | undefined): boolean | undefined => {
  const error = new Error(`Invalid boolean value: ${value}`);
  try {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') {
        return true;
      } else if (value.toLowerCase() === 'false') {
        return false;
      } else {
        throw error;
      }
    }

    if (typeof value === 'boolean') {
      return value;
    }
  } catch (error) {
    throw error;
  }
};
