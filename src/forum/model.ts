import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "../user";

@ObjectType()
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
  @prop({ ref: () => "User" })
  author: Ref<User>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const ForumModel = getModelForClass(Forum, {
  schemaOptions: { timestamps: true },
});
