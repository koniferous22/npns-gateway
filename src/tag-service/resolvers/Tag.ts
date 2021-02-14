import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Tag } from '../entities/Tag';

@ArgsType()
class CreateTagArgs {
  @Field()
  name!: string;
  @Field(() => ID)
  parentId!: string;

  constructor(name: string, parentId: string) {
    this.name = name;
    this.parentId = parentId;
  }
}

@ObjectType()
class CreateTagPayload {
  @Field()
  message!: string;
  @Field(() => Tag)
  createdTag!: Tag;

  constructor(message: string, createdTag: Tag) {
    this.message = message;
    this.createdTag = createdTag;
  }
}

@ObjectType()
class DeleteTagPayload {
  @Field()
  message!: string;

  constructor(message: string) {
    this.message = message;
  }
}

@Resolver(() => Tag)
export class TagResolver {
  // TODO not any advantage of using custom decorators
  private tagRepo = getConnection('tag').getTreeRepository(Tag);

  @Query(() => [Tag])
  async tags(@Arg('root', { nullable: true }) root?: string): Promise<Tag[]> {
    // const tagRepo = getConnection('tag').getTreeRepository(Tag);
    if (!root) {
      return this.tagRepo.find();
    }
    const rootTag = await this.tagRepo.findOne({ name: root });
    if (!rootTag) {
      throw new Error(`Tag '${root}' not found`);
    }
    return this.tagRepo.findDescendants(rootTag);
  }

  @Mutation(() => CreateTagPayload)
  async createTag(@Args() { name, parentId }: CreateTagArgs) {
    const parentTag = await this.tagRepo.findOne(parentId);
    if (!parentTag) {
      throw new Error(`No parent with id ${parentId} found`);
    }
    const tag = this.tagRepo.create({
      id: uuidv4(),
      name,
      parent: parentTag
    });
    await this.tagRepo.save(tag);
    return new CreateTagPayload('Tag created', tag);
  }

  @Mutation(() => DeleteTagPayload)
  async deleteTag(@Arg('name') name: string) {
    const tag = await this.tagRepo.findOne({ name });
    if (!tag) {
      throw new Error(`No tag '${name}' found`);
    }
    const tagDescendants = await this.tagRepo.findDescendantsTree(tag);
    if (tagDescendants.children.length > 0) {
      throw new Error(`Cannot delete tag '${name}', delete descendants first`);
    }
    await this.tagRepo.remove(tag);
    return new DeleteTagPayload(`Tag '${name}' deleted`);
  }

  @FieldResolver()
  parent(@Root() tag: Tag) {
    return this.tagRepo.findOne({
      cache: 1000,
      where: { id: tag.parent }
    });
  }
}
