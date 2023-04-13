import { prop, getModelForClass } from "@typegoose/typegoose";
import { ObjectType, Field, ID } from "type-graphql";

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
}

export const ForumModel = getModelForClass(Forum, {
  schemaOptions: { timestamps: true },
});
