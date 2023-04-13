import { prop, getModelForClass, Ref, plugin } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";
import populate from "mongoose-autopopulate";

import { User } from "../user";
import { Post } from "../post";

@ObjectType()
@plugin(populate)
export class Thread {
  @Field(() => ID)
  _id: string;

  @Field(() => User)
  @prop({ ref: () => "User", autopopulate: true })
  author: Ref<User>;

  @Field(() => [Post])
  @prop({ ref: () => "Post", default: [] })
  children: Array<Ref<Post>>;

  @Field(() => Post)
  @prop({ ref: () => "Post", autopopulate: true })
  genisis: Ref<Post>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ThreadModel = getModelForClass(Thread, {
  schemaOptions: { timestamps: true },
});
