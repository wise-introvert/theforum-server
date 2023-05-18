import { Resolver, Arg, Query, FieldResolver, Root } from "type-graphql";
import { Types } from "mongoose";
import { get, isEmpty } from "lodash";

import * as ThreadService from "./service";
import { Thread, ThreadModel } from ".";
import { PostModel, Post } from "../post";
import { UserModel, User } from "../user";
import { ForumModel, Forum } from "../forum";

@Resolver((_?: void | undefined) => Thread)
export class ThreadResolver {
  @Query(() => [Thread])
  async threads(): Promise<Thread[]> {
    return ThreadService.threads();
  }

  @Query(() => Thread)
  async thread(@Arg("id") id: string): Promise<Thread | null | undefined> {
    console.log(`\n\n\t\t---> id (${id})\n\n`);
    return ThreadModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  @FieldResolver(() => Forum)
  async forum(@Root() thread: any): Promise<Forum | undefined | null> {
    console.log(`\n\n\t\t---> forum (${get(thread, "forum", "")})\n\n`);
    return ForumModel.findOne({
      _id: new Types.ObjectId(thread.forum),
    });
  }

  @FieldResolver(() => Post)
  async genisis(@Root() thread: any): Promise<Post | undefined | null> {
    console.log(`\n\n\t\t---> genisis (${thread.genisis})\n\n`);
    return PostModel.findOne({
      _id: new Types.ObjectId(thread.genisis),
    });
  }

  @FieldResolver(() => [Post])
  async children(@Root() thread: any): Promise<Array<Post>> {
    return PostModel.find({
      _id: {
        $in: thread.children.map((child: string) => new Types.ObjectId(child)),
      },
    });
  }

  @FieldResolver(() => User)
  async author(@Root() thread: any): Promise<User | null> {
    console.log(`\n\n\t\t---> author (${get(thread, "author", "")})\n\n`);
    console.log(JSON.stringify(thread, null, 2));

    let author: User | null;
    if(!isEmpty(get(thread, "author", ""))) {
    author = await UserModel.findOne({
      _id: new Types.ObjectId(thread.author),
    });

    return author;
    }

    const genisis: Post | null = await PostModel.findOne({
      _id: new Types.ObjectId(get(thread, "genisis"))
    });
    author = await UserModel.findOne({
      _id: new Types.ObjectId(get(genisis, "author", "") as string),
    });
    return author;
  }
}
