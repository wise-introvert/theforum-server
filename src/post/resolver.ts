import { Mutation, Resolver, Arg, Query } from "type-graphql";

import { Post, CreatePostInput } from ".";
import * as PostService from "./service";

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return PostService.posts();
  }

  @Mutation(() => Post)
  async post(@Arg("input") input: CreatePostInput): Promise<Post> {
    return PostService.post(input);
  }
}
