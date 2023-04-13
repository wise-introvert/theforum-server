import get from "lodash.get";
import isEmpty from "lodash.isempty";
import omit from "lodash.omit";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import md5 from "md5";

import {
  UserRegistrationInput,
  registrationValidationSchema,
  loginValidationSchema,
  UserLoginInput,
} from "./dto";
import { User, UserModel } from "./model";

export const register = async (input: UserRegistrationInput): Promise<User> => {
  try {
    // validate input
    await registrationValidationSchema.validate(input);

    // check for duplicates
    const dup: User | null = await UserModel.findOne({
      username: get(input, "username", undefined),
    });

    if (!isEmpty(dup)) {
      throw new Error("Invalid username. Please use a different username.");
    }

    // hash password
    const namak: string = genSaltSync(12);
    const hashed: string = hashSync(get(input, "password", ""), namak);

    const createdUser: User = await UserModel.create({
      ...omit(input, "confirmPassword"),
      password: hashed,
      avatar: get(
        input,
        "image",
        `https://www.gravatar.com/avatar/${md5(
          `${get(input, "username", "")}@forum.com`
        )}?s=500&d=retro`
      ),
    });

    return omit(createdUser, "password") as User;
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
