import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';
import waitOn from 'wait-on';
import { getConfig } from './config';

// TODO uninstall
// * apollo federation
// * graphql-tag
// * type-graphql
// * typeorm

const bootstrap = async () => {
  const { port, tagServiceHost, tagServicePort } = getConfig();
  const serviceList = [
    { name: 'tag', url: `${tagServiceHost}:${tagServicePort}` }
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
