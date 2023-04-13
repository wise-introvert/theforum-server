import { prop, getModelForClass, Ref, plugin } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";
import populate from "mongoose-autopopulate";

import { User } from "../user";
import { Post } from "../post";

@ObjectType()
@plugin(populate)
export class Forum {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop({ nullable: false /*, unique: true */ })
  title!: string;

  @Field()
  @prop({ nullable: true, default: "" })
  description!: string;

  @Field()
  @prop({ nullable: true })
  image?: string;

  @Field(() => User)
  @prop({ ref: () => "User", autopopulate: true })
  author: Ref<User>;

  @Field(() => [Post])
  @prop({ ref: () => "Post", default: [] })
  posts: Array<Ref<Post>>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ForumModel = getModelForClass(Forum, {
  schemaOptions: { timestamps: true },
});
