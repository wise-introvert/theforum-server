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
import { Thread, ThreadModel } from "../thread";

export const post = async (input: CreatePostInput): Promise<Post> => {
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

    forum.posts?.push(post._id);

    if (get(post, "genisis")) {
      // create a new thread
      const thread: Thread = await ThreadModel.create({
        genisis: post,
        forum: forum._id,
        author,
      });
      post.thread = thread._id;
      forum.threads.push(thread._id);
    }

    await UserModel.updateOne({ _id: author._id }, author);
    await ForumModel.updateOne({ _id: forum._id }, forum);
    await PostModel.updateOne({ _id: post._id }, post);

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
};

export const posts = async (): Promise<Post[]> =>
  PostModel.find()
    .sort({ updatedAt: "desc" })
    .limit(10)
    .populate(["createdAt", "author", "thread", "parentPost"]);
