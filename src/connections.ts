import { getConnectionManager, getConnectionOptions } from 'typeorm';

const connectionManager = getConnectionManager();

type ServiceKey = 'account' | 'tag' | 'challenge';
const connections: Record<
  ServiceKey,
  ReturnType<typeof connectionManager['create']> | null
> = {
  account: null,
  tag: null,
  challenge: null
};

export const getConnection = async (service: ServiceKey) => {
  if (connections[service] === null) {
    const options = await getConnectionOptions(service);
    const newConnection = connectionManager.create(options);
    await newConnection.connect();
    connections[service] = newConnection;
  }
  return connections[service];
};
