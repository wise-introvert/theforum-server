import { Mutation, Resolver, Arg, Query } from "type-graphql";

import { User, UserRegistrationInput, UserLoginInput } from ".";
import * as UserService from "./service";

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  health(): string {
    return "fit";
  }

  @Mutation(() => User)
  async register(@Arg("input") input: UserRegistrationInput): Promise<User> {
    return UserService.register(input);
  }

  @Mutation(() => User)
  async login(@Arg("input") input: UserLoginInput): Promise<User> {
    return UserService.login(input);
  }
}
