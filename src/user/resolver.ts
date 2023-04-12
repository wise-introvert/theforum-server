import { Mutation, Resolver, Arg, Query } from "type-graphql";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import omit from "lodash.omit";
import { hashSync, genSaltSync, compareSync } from "bcrypt";

import {
  User,
  UserRegistrationInput,
  UserLoginInput,
  registrationValidationSchema,
  loginValidationSchema,
  UserModel,
} from ".";

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  health(): string {
    return "fit";
  }

  @Mutation(() => User)
  async register(@Arg("input") input: UserRegistrationInput): Promise<User> {
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

      return await UserModel.create({
        ...omit(input, "confirmPassword"),
        password: hashed,
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

  @Mutation(() => User)
  async login(@Arg("input") input: UserLoginInput): Promise<User> {
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

      return user;
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
