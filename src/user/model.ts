import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

import { Forum } from "../forum";

@ObjectType()
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
  @prop({ default: [], ref: () => Forum })
  forums?: Array<Ref<Forum>>;

  @Field()
  @prop({ nullable: true })
  avatar?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
