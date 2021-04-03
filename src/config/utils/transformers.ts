import { URL } from 'url';
import { ConfigValidationError } from '../../utils/exceptions';
import { ArrayElement } from '../../utils/generics';

export const getUrl = (env: string, configPath: string) => {
  try {
    new URL(env);
    return env;
  } catch (e) {
    throw new ConfigValidationError(configPath, 'URL', env);
  }
};

export const getNumber = (env: string, configPath: string) => {
  const number = parseInt(env, 10);
  if (Number.isNaN(number)) {
    throw new ConfigValidationError(configPath, 'number', env);
  }
  return number;
};

export const getEndpoint = (env: string, configPath: string) => {
  // TODO validate allowed url characters
  if (!env.startsWith('/')) {
    throw new ConfigValidationError(configPath, 'endpoint', env);
  }
  return env;
};

export function getEnum<T extends string>(allowedValues: T[]) {
  return (env: string, configPath: string) => {
    if (!allowedValues.includes(env as T)) {
      throw new ConfigValidationError(
        configPath,
        `enum with allowed values [${allowedValues.join(', ')}]`,
        env
      );
    }
    return env as ArrayElement<typeof allowedValues>;
  };
}
