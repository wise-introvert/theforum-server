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

interface BuildMakeForumProps {
  md5: (value: string) => string;
  findForumByHash: <T = any>(id: string) => Promise<T>;
  findAuthorById: <T = any>(id: string) => Promise<T>;
  createID: (...args: any[]) => string;
}

export const buildMakeForum = ({
  findForumByHash,
  findAuthorById,
  md5,
  createID,
}: BuildMakeForumProps): Function => {
  return async function createForum(
    input: CreateForumInput
  ): Promise<Interfaces.ForumWithMethods> {
    try {
      // validate input
      await createForumValidationSchema.validate(input);

      let inputWithDefaultValues = {
        id: createID(),
        // @ts-ignore
        title: "",
        description: "",
        // @ts-ignore
        author: "",
        image: `https://www.gravatar.com/avatar/${md5(
          `${get(input, "title", "")}@forum.com`
        )}?s=500&d=retro`,
        threads: [],
        ...input,
      };

      const hash: string = md5(
        JSON.stringify({
          title: inputWithDefaultValues.title,
        })
      );

      const dup = await findForumByHash(hash);

      if (!isEmpty(dup)) {
        inputWithDefaultValues = dup as any;
      }

      const author: User | null = await findAuthorById(
        get(input, "author", "")
      );

      if (isEmpty(author)) {
        throw new Error("Invalid author!");
      }

      return Object.freeze({
        getID: (): string => inputWithDefaultValues.id,
        getTitle: (): string => inputWithDefaultValues.title,
        getDescription: (): string => inputWithDefaultValues.description,
        getImage: (): string => inputWithDefaultValues.image,
        getAuthorID: (): string => author._id.toString(),
        getThreadIDs: (): Array<string> => inputWithDefaultValues.threads,
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
  };
};

export const forums = async () => ForumModel.find().populate(["threads"]);

export const forum = async (input: CreateForumInput): Promise<Forum> => {
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
};

export const findForum = async (id: string): Promise<Forum | null> => {
  return ForumModel.findOne({ _id: new Types.ObjectId(id) }).populate([
    "threads",
  ]);
};
