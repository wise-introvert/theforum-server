import { prop, getModelForClass, Ref, plugin } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";
import populate from "mongoose-autopopulate";

import { User } from "../user";

@ObjectType()
@plugin(populate)
export class Post {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop({ nullable: false /*, unique: true */ })
  title!: string;

  @Field()
  @prop({ nullable: false })
  content!: string;

  @Field(() => User)
  @prop({ ref: () => "User", autopopulate: true })
  author: Ref<User>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const PostModel = getModelForClass(Post, {
  schemaOptions: { timestamps: true },
});
