import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "../user";
import { Post } from "../post";
import { Thread } from "../thread";

@ObjectType()
export class Forum {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop({ nullable: false /*, unique: true */ })
  title!: string;

  @Field()
  @prop()
  hash!: string;

  @Field()
  @prop({ nullable: true, default: "" })
  description!: string;

  @Field()
  @prop({ nullable: true })
  image?: string;

  @Field(() => User)
  @prop({ ref: () => "User" })
  author: Ref<User>;

  @Field(() => [Post])
  posts: Array<Ref<Post>>;

  @Field(() => [Thread])
  threads: Array<Ref<Thread>>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ForumModel = getModelForClass(Forum, {
  schemaOptions: { timestamps: true },
});
