import { prop, getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @prop({ nullable: false })
  username: string;

  @Field()
  @prop({ nullable: false })
  password: string;

  @Field()
  @prop({ nullable: false })
  email: string;

  @Field()
  @prop({ nullable: false })
  hash: string;

  @Field()
  @prop({ nullable: true, default: "" })
  description: string;

  @Field()
  @prop({ nullable: true })
  avatar: string;

  @Field(() => Date)
  lastActive: Date;

  @Field()
  isArchived: boolean;

  @Field()
  isVerified: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
