import { buildSchema } from 'type-graphql';
import { TagResolver } from './resolvers/Tag';

export const getTagServiceSchema = () =>
  buildSchema({
    resolvers: [TagResolver]
  });
