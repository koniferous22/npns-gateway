import {
  resolveConfigEntry,
  GetConfigValueByKeyString,
  ConfigEntryType,
  ResolveConfigType,
  GetObjectValues
} from './utils/generics';
import { getNumber, getUrl } from './utils/transformers';

const configWithParser = {
  port: {
    type: 'leaf' as const,
    originalValue: process.env.PORT,
    transform: getNumber,
    overridenValue: null as null | string
  },
  tag: {
    type: 'node' as const,
    children: {
      host: {
        type: 'leaf' as const,
        originalValue: process.env.TAG_SERVICE_HOST,
        transform: getUrl,
        overridenValue: null as null | string
      },
      port: {
        type: 'leaf' as const,
        originalValue: process.env.TAG_SERVICE_PORT,
        transform: getNumber,
        overridenValue: null as null | string
      }
    }
  },
  account: {
    type: 'node' as const,
    children: {
      host: {
        type: 'leaf' as const,
        originalValue: process.env.ACCOUNT_SERVICE_HOST,
        transform: getUrl,
        overridenValue: null as null | string
      },
      port: {
        type: 'leaf' as const,
        originalValue: process.env.ACCOUNT_SERVICE_PORT,
        transform: getNumber,
        overridenValue: null as null | string
      }
    }
  }
};

export type ConfigType = ResolveConfigType<typeof configWithParser>;

const resolveConfig: () => ConfigType = () =>
  resolveConfigEntry(configWithParser);

let config = resolveConfig();
let settingsChanged = false;

export const getConfig = () => {
  if (settingsChanged) {
    config = resolveConfig();
  }
  return config;
};

export function overrideConfig<KeyString extends string>(
  keyString: KeyString,
  newValue: GetConfigValueByKeyString<KeyString, typeof configWithParser>
) {
  const keys = keyString.split('.');
  let current: GetObjectValues<ConfigEntryType> = {
    type: 'node',
    children: configWithParser
  };
  keys.forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(key in current) || !(('children' in (current as any)[key]) as any)) {
      throw new Error(`Configuration key '${keyString}' does not exist`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current = (current as any)[key].children;
  });
  if (!['leaf'].includes(current.type)) {
    throw new Error(
      `Configuration key '${keyString}' references object and not leaf value`
    );
  }
  // @ts-expect-error Wrong ts inferring because of for-each
  current.overridenValue = newValue;
  settingsChanged = true;
}
