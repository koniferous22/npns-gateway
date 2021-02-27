import { URL } from 'url';

export const getUrl = (env: string, configPath: string) => {
  try {
    new URL(env);
    return env;
  } catch (e) {
    throw new Error(
      `Invalid config value for "${configPath}" expected URL format, got "${env}"`
    );
  }
};

export const getEndpoint = (env: string, configPath: string) => {
  // TODO validate allowed url characters
  if (!env.startsWith('/')) {
    throw new Error(
      `Invalid config value for "${configPath}" expected endpoint, got "${env}"`
    );
  }
  return env;
};

export const getNumber = (env: string, configPath: string) => {
  const number = parseInt(env, 10);
  if (Number.isNaN(number)) {
    throw new Error(
      `Invalid config value for "${configPath}" expected number, got "${env}"`
    );
  }
  return number;
};
