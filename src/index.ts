import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { printSchema } from 'graphql';
import gql from 'graphql-tag';
import { createResolversMap } from 'type-graphql';
import { getSchema as getHelloWorldSchema } from './hello-world-service';
import { getSchema as getTypeGraphQLSchema } from './account-service';
import {
  getAccountServiceConnection,
  getTagServiceConnection
} from './connections';

const bootstrap = async () => {
  const accountConnection = await getAccountServiceConnection();
  const tagConnection = await getTagServiceConnection();
  const serviceSchemas = await Promise.all([
    getHelloWorldSchema(),
    getTypeGraphQLSchema()
  ]);

  const server = new ApolloServer({
    schema: buildFederatedSchema(
      serviceSchemas.map((schema) => ({
        typeDefs: gql(printSchema(schema)),
        resolvers: createResolversMap(schema) as any
      }))
    )
  });
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

bootstrap();
