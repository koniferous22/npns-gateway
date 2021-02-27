import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';
import waitOn from 'wait-on';
import { getConfig } from './config';

const bootstrap = async () => {
  const { port, tag, account } = getConfig();
  const services = {
    tag,
    account
  };
  const serviceList = Object.entries(services).map(
    ([name, { host, port, graphqlPath }]) => ({
      name,
      url: `${host}:${port}${graphqlPath}`
    })
  );
  const serviceHealthChecks = Object.entries(services).map(
    ([, { host, port }]) => `${host}:${port}/.well-known/apollo/server-health`
  );
  await waitOn({
    resources: serviceHealthChecks,
    log: true,
    interval: 250
  });
  const gateway = new ApolloGateway({
    serviceList: serviceList,
    serviceHealthCheck: true
  });
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    executor,
    tracing: false,
    playground: true
  });
  server.listen({ port }).then(({ url }) => {
    console.log(`🚀  NPNS gateway ready at ${url}`);
  });
};

bootstrap();
