import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

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
}

export const UserModel = getModelForClass(User);
