import {
  GetConfigValueByKeyString,
  ConfigAstNode,
  ResolveConfigAstNode,
  resolveConfigNode
} from './utils/generics';
import { getEndpoint, getEnum, getNumber, getUrl } from './utils/transformers';

const configWithParser = {
  type: 'node' as const,
  children: {
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
        },
        graphqlPath: {
          type: 'leaf' as const,
          originalValue: process.env.TAG_SERVICE_GRAPHQL_PATH,
          transform: getEndpoint,
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
        },
        graphqlPath: {
          type: 'leaf' as const,
          originalValue: process.env.ACCOUNT_SERVICE_GRAPHQL_PATH,
          transform: getEndpoint,
          overridenValue: null as null | string
        },
        jwt: {
          type: 'node' as const,
          children: {
            secret: {
              type: 'leaf' as const,
              originalValue: process.env.ACCOUNT_SERVICE_JWT_SECRET,
              overridenValue: null as null | string
            },
            algorithm: {
              type: 'leaf' as const,
              originalValue: process.env.ACCOUNT_SERVICE_JWT_ALGORITHM,
              transform: getEnum(['HS256']),
              overridenValue: null as null | string
            }
          }
        }
      }
    },
    challenge: {
      type: 'node' as const,
      children: {
        host: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_SERVICE_HOST,
          transform: getUrl,
          overridenValue: null as null | string
        },
        port: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_SERVICE_PORT,
          transform: getNumber,
          overridenValue: null as null | string
        },
        graphqlPath: {
          type: 'leaf' as const,
          originalValue: process.env.CHALLENGE_SERVICE_GRAPHQL_PATH,
          transform: getEndpoint,
          overridenValue: null as null | string
        }
      }
    }
  }
};

export type ConfigType = ResolveConfigAstNode<typeof configWithParser>;

const resolveConfig: () => ConfigType = () => {
  const { config, errors } = resolveConfigNode(configWithParser);
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
  return config;
};
let config = resolveConfig();
let settingsChanged = false;

export const getConfig = () => {
  if (settingsChanged) {
    config = resolveConfig();
    settingsChanged = false;
  }
  return config;
};

export function overrideConfig<KeyString extends string>(
  keyString: KeyString,
  newValue: GetConfigValueByKeyString<KeyString, typeof configWithParser>
) {
  const keys = keyString.split('.');
  let current: ConfigAstNode = configWithParser;
  keys.forEach((key) => {
    switch (current.type) {
      case 'node': {
        current = current.children[key];
        break;
      }
      case 'array': {
        const index = parseInt(key, 10);
        current = current.values[index];
        break;
      }
      case 'leaf': {
        throw new Error(`Key string "${keyString}" out of range`);
      }
      default: {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          `Encountered invalid node type: "${current && current!.type}"`
        );
      }
    }
  });
  if (!['leaf'].includes(current.type)) {
    throw new Error(
      `Configuration key '${keyString}' references object and not leaf value`
    );
  }
  // @ts-expect-error Wrong ts inferring because of for-each
  current.overridenValue = newValue.toString();
  settingsChanged = true;
}
