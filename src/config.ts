import { URL } from 'url';

// TODO potential internal package for now copypaste
const getUrl = (env: string, configPath: string) => {
  try {
    new URL(env);
    return env;
  } catch (e) {
    throw new Error(
      `Invalid config value for "${configPath}" expected URL format, got "${env}"`
    );
  }
};

const getNumber = (env: string, configPath: string) => {
  const number = parseInt(env, 10);
  if (Number.isNaN(number)) {
    throw new Error(
      `Invalid config value for "${configPath}" expected number, got "${env}"`
    );
  }
  return number;
};

const configWithParser = {
  port: {
    originalValue: process.env.PORT,
    transform: 'number' as const
  },
  tagServiceHost: {
    originalValue: process.env.TAG_SERVICE_HOST,
    transform: 'url' as const
  },
  tagServicePort: {
    originalValue: process.env.TAG_SERVICE_PORT,
    transform: 'number' as const
  }
};

const configWithParser2 = {
  port: {
    originalValue: process.env.PORT,
    transform: getNumber,
    overridenValue: null as null | string
  },
  tagServiceHost: {
    originalValue: process.env.TAG_SERVICE_HOST,
    transform: getUrl,
    overridenValue: null as null | string
  },
  tagServicePort: {
    originalValue: process.env.TAG_SERVICE_PORT,
    transform: getNumber,
    overridenValue: null as null | string
  }
};

type ConfigType = {
  [key in keyof typeof configWithParser2]: ReturnType<
    typeof configWithParser2[key]['transform']
  >;
};

const resolveConfig: () => ConfigType = () =>
  Object.fromEntries(
    Object.entries(configWithParser2).map(
      ([key, { originalValue, transform, overridenValue }]) => {
        if (!originalValue) {
          throw new Error();
        }
        return [key, transform(overridenValue ?? originalValue, key)];
      }
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;

// TODO define this function recursively when configuration grows
let config = resolveConfig();
let settingsChanged = false;

export const getConfig = () => {
  if (settingsChanged) {
    config = resolveConfig();
  }
  return config;
};

export const overrideConfig = (
  key: keyof typeof configWithParser,
  newValue: string | undefined
) => {
  configWithParser[key].originalValue = newValue;
  settingsChanged = true;
};
