import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';
import waitOn from 'wait-on';
import { getConfig } from './config';

const bootstrap = async () => {
  const { port, tag, account } = getConfig();
  const serviceList = [
    { name: 'tag', url: `${tag.host}:${tag.port}` },
    { name: 'account', url: `${account.host}:${account.port}` }
  ];
  const serviceUrls = serviceList.map(({ url }) => url);
  await waitOn({
    resources: serviceUrls.map(
      (url) => `${url}/.well-known/apollo/server-health`
    ),
    log: true,
    interval: 250
  });
  const gateway = new ApolloGateway({
    serviceList,
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
