import { getConnectionManager } from 'typeorm';

const connectionManager = getConnectionManager();

type ServiceKey = 'account' | 'tag';
const connections: Record<
  ServiceKey,
  ReturnType<typeof connectionManager['create']> | null
> = {
  account: null,
  tag: null
};
export const getAccountServiceConnection = async () => {
  if (!connections.account) {
    if (
      !process.env.ACCOUNT_DB_TYPE ||
      !process.env.ACCOUNT_DB_HOST ||
      !process.env.ACCOUNT_DB_PORT ||
      !process.env.ACCOUNT_DB_USERNAME ||
      !process.env.ACCOUNT_DB_PASSWORD ||
      !process.env.ACCOUNT_DB_DATABASE
    ) {
      throw new Error('Invalid env configuration for account database');
    }

    connections.account = connectionManager.create({
      name: 'account',
      type: process.env.ACCOUNT_DB_TYPE as any,
      host: process.env.ACCOUNT_DB_HOST,
      port: parseInt(process.env.ACCOUNT_DB_PORT, 10),
      username: process.env.ACCOUNT_DB_USERNAME,
      password: process.env.ACCOUNT_DB_PASSWORD,
      database: process.env.ACCOUNT_DB_DATABASE,
      synchronize: true,
      logging: 'all'
      // entities: []
    });
    await connections.account.connect();
  }
  return connections.account;
};

export const getTagServiceConnection = async () => {
  if (!connections.tag) {
    if (
      !process.env.TAG_DB_TYPE ||
      !process.env.TAG_DB_HOST ||
      !process.env.TAG_DB_PORT ||
      !process.env.TAG_DB_USERNAME ||
      !process.env.TAG_DB_PASSWORD ||
      !process.env.TAG_DB_DATABASE
    ) {
      throw new Error('Invalid env configuration for tag database');
    }

    connections.tag = connectionManager.create({
      name: 'tag',
      type: process.env.TAG_DB_TYPE as any,
      host: process.env.TAG_DB_HOST,
      port: parseInt(process.env.TAG_DB_PORT, 10),
      username: process.env.TAG_DB_USERNAME,
      password: process.env.TAG_DB_PASSWORD,
      database: process.env.TAG_DB_DATABASE,
      synchronize: true,
      logging: 'all'
      // entities: []
    });
    await connections.tag.connect();
  }
  return connections.tag;
};
