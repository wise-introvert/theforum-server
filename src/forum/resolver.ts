import { Mutation, Resolver, Arg, Query } from "type-graphql";

import { Forum, CreateForumInput } from ".";
import * as ForumService from "./service";

@Resolver(Forum)
export class ForumResolver {
  @Query(() => [Forum])
  async forums(): Promise<Forum[]> {
    return ForumService.forums();
  }

  @Mutation(() => Forum)
  async forum(@Arg("input") input: CreateForumInput): Promise<Forum> {
    return ForumService.forum(input);
  }
}
