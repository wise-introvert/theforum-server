import { Mutation, Resolver, Arg, Query } from "type-graphql";
import { Types } from "mongoose";
import get from "lodash.get";
import isEmpty from "lodash.isempty";

import {
  Post,
  createPostValidationSchema,
  CreatePostInput,
  PostModel,
} from ".";
import { User, UserModel } from "../user";
import { Forum, ForumModel } from "../forum";

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return PostModel.find();
  }

  @Mutation(() => Post)
  async post(@Arg("input") input: CreatePostInput): Promise<Post> {
    try {
      // validate input
      await createPostValidationSchema.validate(input);

      const author: User | null = await UserModel.findOne({
        _id: new Types.ObjectId(get(input, "author", "")),
      });

      if (isEmpty(author)) {
        throw new Error("Invalid author!");
      }

      const forum: Forum | null = await ForumModel.findOne({
        _id: new Types.ObjectId(get(input, "forum", "")),
      });

      if (isEmpty(forum)) {
        throw new Error("Invalid forum!");
      }

      const post: Post = await PostModel.create({
        ...input,
        author,
        forum,
      });

      author.posts?.push(post._id);
      forum.posts?.push(post._id);

      await UserModel.updateOne({ _id: author._id }, author);
      await ForumModel.updateOne({ _id: forum._id }, forum);

      return post;
    } catch (err) {
      throw new Error(
        get(
          err,
          "message",
          "Something went wrong. Please try again after some time."
        )
      );
    }
  }
}
