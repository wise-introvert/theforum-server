import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "../user";
import { Thread } from "../thread";

@ObjectType()
export class Post {
  @Field(() => ID)
  _id: string;

  @Field({ nullable: true })
  @prop({ nullable: true /*, unique: true */ })
  title!: string;

  @Field({ nullable: true })
  @prop({ nullable: false })
  content!: string;

  @Field(() => User, { nullable: true })
  @prop({ ref: () => "User" })
  author: Ref<User>;

  @Field(() => Thread, { nullable: true })
  @prop({ ref: () => "Thread", nullable: true })
  thread?: Ref<Thread>;

  @Field(() => Post, { nullable: true })
  @prop({ ref: () => "Post", nullable: true })
  parentPost?: Ref<Post>;

  @Field(() => [Post])
  @prop({ ref: () => "Post" })
  children: Array<Ref<Post>>;

  @Field(() => Boolean, { nullable: true })
  @prop({ default: true })
  genisis?: boolean;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

export const PostModel = getModelForClass(Post, {
  schemaOptions: { timestamps: true },
});
