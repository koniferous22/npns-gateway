import {
  ObjectType,
  Field,
  ID,
  Arg,
  Query,
  Resolver,
  buildSchema
} from 'type-graphql';

@ObjectType()
class Recipe {
  @Field((type) => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate!: Date;

  @Field((type) => [String])
  ingredients!: string[];
}

class RecipeNotFoundError extends Error {}

class RecipeService {
  async findById(id: string) {
    return {
      id
    };
  }
}

@Resolver(Recipe)
class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query((returns) => Recipe)
  async recipe(@Arg('id') id: string) {
    const recipe = await this.recipeService.findById(id);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(id);
    }
    return recipe;
  }
}

export const getSchema = () =>
  buildSchema({
    resolvers: [RecipeResolver]
  });
