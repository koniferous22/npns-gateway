import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { printSchema } from 'graphql';
import gql from 'graphql-tag';
import { createResolversMap } from 'type-graphql';
import { getSchema as getTypeGraphQLSchema } from './account-service';
import { getConnection } from './connections';

const bootstrap = async () => {
  const accountConnection = await getConnection('account');
  const tagConnection = await getConnection('tag');
  const challengeConnection = await getConnection('challenge');
  const serviceSchemas = await Promise.all([getTypeGraphQLSchema()]);

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
