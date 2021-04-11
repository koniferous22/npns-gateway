import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import express from 'express';
import expressJwt from 'express-jwt';
import waitOn from 'wait-on';
import { Config } from './config';

const bootstrap = async () => {
  const {
    port,
    account,
    challenge,
    multiWriteProxy
  } = Config.getInstance().getConfig();
  const services = {
    account,
    challenge,
    multiWriteProxy
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

  const app = express();
  app.use(
    expressJwt({
      // NOTE validated by runtime config validators
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      secret: account.jwt.secret!,
      algorithms: [account.jwt.algorithm],
      credentialsRequired: false
    })
  );

  const gateway = new ApolloGateway({
    serviceList: serviceList,
    serviceHealthCheck: true,
    // NOTE inspiration: https://www.apollographql.com/blog/setting-up-authentication-and-authorization-with-apollo-federation/
    buildService: ({ url }) =>
      new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          if (context.user) {
            request.http?.headers.set('user', JSON.stringify(context.user));
          }
        }
      })
  });
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      user: req.user ?? null
    }),
    executor,
    tracing: false,
    playground: true
  });
  server.applyMiddleware({
    app
  });
  app.listen({ port }, () => {
    console.log(
      `🚀 NPNS Gateway ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
};

bootstrap();
