import { Mutation, Resolver, Arg, Query } from "type-graphql";
import get from "lodash.get";
import md5 from "md5";

import {
  Forum,
  createForumValidationSchema,
  CreateForumInput,
  ForumModel,
} from ".";

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

      return await ForumModel.create({
        ...input,
        image: get(
          input,
          "image",
          `https://www.gravatar.com/avatar/${md5(
            `${get(input, "title", "")}@forum.com`
          )}?s=500&d=identicon`
        ),
      });
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
