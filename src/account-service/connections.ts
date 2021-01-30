import { getConnectionManager } from 'typeorm';
import { tryConnectingNAttempts } from '../utils/connectMaxNAttempts';

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
      throw new Error('Invalid env configuration for database');
    }

    connections.account = connectionManager.create({
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
    await tryConnectingNAttempts(connections.account);
  }
  return connections.account;
};
