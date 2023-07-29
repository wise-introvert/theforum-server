import get from "lodash.get";
import isEmpty from "lodash.isempty";
import omit from "lodash.omit";
import { hashSync, compareSync } from "bcrypt";
import md5 from "md5";
import { Types } from "mongoose";

import {
  UserRegistrationInput,
  registrationValidationSchema,
  loginValidationSchema,
  UserLoginInput,
} from "./dto";
import { User, UserModel } from "./model";

interface BuildMakeUserProps {
  hashFunction: (value: string) => string;
  md5: (value: string) => string;
  findUserByHash: <T = any>(id: string) => Promise<T>;
  createID: (...args: any[]) => string;
}

export const buildMakeUser = ({
  hashFunction,
  findUserByHash,
  md5,
  createID,
}: BuildMakeUserProps): Function => {
  return async function makeUser(
    input: UserRegistrationInput
  ): Promise<Interfaces.UserWithMethods> {
    try {
      // validate input
      await registrationValidationSchema.validate(input);

      let inputWithDefaultValues = {
        id: createID(),
        // @ts-ignore
        email: "",
        // @ts-ignore
        username: "",
        // @ts-ignore
        password: "",
        description: "",
        avatar: `https://www.gravatar.com/avatar/${md5(
          `${get(input, "username", "")}@forum.com`
        )}?s=500&d=retro`,
        isVerified: false,
        isArchived: false,
        lastActive: new Date().toISOString(),
        ...input,
      };

      const hash: string = md5(
        JSON.stringify({
          username: inputWithDefaultValues.username,
          email: inputWithDefaultValues.email,
        })
      );

      // check for duplicates
      const dup: User | null = await findUserByHash(hash);

      let hashed: string;
      if (!isEmpty(dup)) {
        inputWithDefaultValues = dup as any;
        hashed = dup.password;
      } else {
        // hash password
        hashed = hashFunction(get(inputWithDefaultValues, "password", ""));
      }

      return Promise.resolve(
        Object.freeze({
          getID: (): string => inputWithDefaultValues.id,
          getUsername: (): string => inputWithDefaultValues.username,
          getEmail: (): string => inputWithDefaultValues.email,
          getDescription: (): string => inputWithDefaultValues.description,
          getPasswordHash: (): string => hashed,
          getHash: (): string => hash,
          getAvatar: (): string => inputWithDefaultValues.avatar,
          isVerified: (): boolean => inputWithDefaultValues.isVerified,
          isArchived: (): boolean => inputWithDefaultValues.isArchived,
          getLastActive: (): string => inputWithDefaultValues.lastActive,
        } as any)
      );
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

export const register = async (input: UserRegistrationInput): Promise<User> => {
  try {
    const hash: string = md5(
      JSON.stringify({
        username: input.username,
        email: input.email,
      })
    );

    const dup: User | null = await UserModel.findOne({
      hash,
    });

    if (dup) {
      throw new Error("Invalid username/email");
    }

    const makeUser = buildMakeUser({
      hashFunction: (value: string): string => hashSync(value, 12),
      md5,
      createID: () => new Types.ObjectId().toString(),
      findUserByHash: (hash: string): Promise<any> =>
        UserModel.findOne({
          hash,
        }),
    });

    const user: Interfaces.UserWithMethods = await makeUser(input);

    const insertedUser: User = await UserModel.create({
      username: user.getUsername(),
      password: user.getPasswordHash(),
      email: user.getEmail(),
      description: user.getDescription(),
      hash: user.getHash(),
      avatar: user.getAvatar(),
      isVerified: user.isVerified(),
      isArchived: user.isArchived(),
      lastACtive: user.getLastActive(),
    });

    return insertedUser;
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

export const login = async (input: UserLoginInput): Promise<User> => {
  try {
    // validate input
    await loginValidationSchema.validate(input);

    // check if user exists
    const user: User | null = await UserModel.findOne({
      username: get(input, "username", undefined),
    });

    if (isEmpty(user)) {
      throw new Error("Invalid username/password.");
    }

    const hashed: string = get(user, "password", "hashed");
    const password: string = get(input, "password", "legacy");

    if (!compareSync(password, hashed)) {
      throw new Error("Invalid username/password");
    }

    return omit(user, "password") as User;
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
