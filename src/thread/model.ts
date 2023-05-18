import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "../user";
import { Post } from "../post";
import { Forum } from "../forum";

@ObjectType()
export class Thread {
  @Field(() => ID)
  _id: string;

  @Field(() => User)
  @prop({ ref: () => "User" })
  author: Ref<User>;

  @Field(() => [Post])
  @prop({ ref: () => "Post", default: [] })
  children: Array<Ref<Post>>;

  @Field(() => Post)
  @prop({ ref: () => "Post" })
  genisis: Ref<Post>;

  @Field(() => Forum)
  @prop({ ref: () => "Forum" })
  forum: Ref<Forum>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ThreadModel = getModelForClass(Thread, {
  schemaOptions: { timestamps: true },
});
