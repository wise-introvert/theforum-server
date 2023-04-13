import { prop, getModelForClass, Ref, plugin } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";
import populate from "mongoose-autopopulate";

import { Forum } from "../forum";
import { Post } from "../post";
import { Thread } from "../thread";

@ObjectType()
@plugin(populate)
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop({ unique: true, nullable: false })
  username: string;

  @Field()
  @prop({ nullable: false })
  password: string;

  @Field()
  @prop({ nullable: true, default: "" })
  description: string;

  @Field(() => [Forum])
  @prop({ default: [], ref: () => Forum, autopopulate: true })
  forums: Array<Ref<Forum>>;

  @Field(() => [Thread])
  @prop({ default: [], ref: () => Thread, autopopulate: true })
  threads: Array<Ref<Thread>>;

  @Field(() => [Post])
  @prop({ default: [], ref: () => Post, autopopulate: true })
  posts: Array<Ref<Post>>;

  @Field()
  @prop({ nullable: true })
  avatar: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
