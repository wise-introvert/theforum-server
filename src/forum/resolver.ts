import { Mutation, Resolver, Arg, Query } from "type-graphql";
import { Types } from "mongoose";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import md5 from "md5";

import {
  Forum,
  createForumValidationSchema,
  CreateForumInput,
  ForumModel,
} from ".";
import { User, UserModel } from "../user";

@Resolver(Forum)
export class ForumResolver {
  @Query(() => [Forum])
  async forums(): Promise<Forum[]> {
    return ForumModel.find();
  }

  @Mutation(() => Forum)
  async forum(@Arg("input") input: CreateForumInput): Promise<Forum> {
    try {
      // validate input
      await createForumValidationSchema.validate(input);

      const author: User | null = await UserModel.findOne({
        _id: new Types.ObjectId(get(input, "author", "")),
      });

      if (isEmpty(author)) {
        throw new Error("Invalid author!");
      }

      const forum: Forum = await ForumModel.create({
        ...input,
        image: get(
          input,
          "image",
          `https://www.gravatar.com/avatar/${md5(
            `${get(input, "title", "")}@forum.com`
          )}?s=500&d=identicon`
        ),
        author,
      });

      author.forums?.push(forum._id);

      await UserModel.updateOne({ _id: author._id }, author);

      return forum;
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
