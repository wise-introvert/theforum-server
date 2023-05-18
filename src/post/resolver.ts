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

import { Post, CreatePostInput, PostModel } from ".";
import { User, UserModel } from "../user";
import * as PostService from "./service";

@Resolver((_?: void | undefined) => Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return PostService.posts();
  }

  @Mutation(() => Post)
  async post(@Arg("input") input: CreatePostInput): Promise<Post> {
    return PostService.post(input);
  }

  @FieldResolver(() => [Post])
  async children(@Root() post: any): Promise<Array<Post>> {
    console.log("\n\n-----------------------children--------------------");
    console.log(JSON.stringify(post, null, 2));
    return PostModel.find({
      _id: {
        $in: post.children.map((child: string) => new Types.ObjectId(child)),
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
