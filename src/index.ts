import 'reflect-metadata';
import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { printSchema } from 'graphql';
import gql from 'graphql-tag';
import { createResolversMap } from 'type-graphql';
import { createConnections } from 'typeorm';
import { getTagServiceSchema } from './tag-service';

const bootstrap = async () => {
  await createConnections();
  const serviceSchemas = await Promise.all([getTagServiceSchema()]);

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
