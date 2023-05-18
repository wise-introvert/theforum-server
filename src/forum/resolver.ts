import {
  Mutation,
  Resolver,
  Arg,
  Query,
  FieldResolver,
  Root,
} from "type-graphql";
import { Types } from "mongoose";
import { get } from "lodash";

import { Forum, CreateForumInput, ForumModel } from ".";
import * as ForumService from "./service";
import { User, UserModel } from "../user";
import { Thread, ThreadModel } from "../thread";

@Resolver((_?: void | undefined) => Forum)
export class ForumResolver {
  @Query(() => [Forum])
  async forums(): Promise<Forum[]> {
    console.log("forums");
    return ForumService.forums();
  }

  @Query(() => Forum, { nullable: true })
  async findForum(@Arg("id") id: string): Promise<Forum | null> {
    return ForumModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  @Mutation(() => Forum)
  async forum(@Arg("input") input: CreateForumInput): Promise<Forum> {
    return ForumService.forum(input);
  }

  @FieldResolver(() => [Thread])
  async threads(@Root() forum: any): Promise<Array<Thread>> {
    return ThreadModel.find({
      _id: {
        $in: get(forum, "threads", []),
      },
    });
  }

  @FieldResolver(() => User)
  async author(@Root() forum: any): Promise<User | null> {
    const author: User | null = await UserModel.findOne({
      _id: new Types.ObjectId(get(forum, "author", "") as string),
    });

    console.log("result: ", author!._id);

    return author;
  }
}
