import { InputType, Field } from "type-graphql";
import * as yup from "yup";

export const createForumValidationSchema = yup.object({
  title: yup
    .string()
    .required("Forum's title cannot be empty")
    .min(4, "Forum's title should be atleast 4 characters long.")
    .max(18, "Forum's title cannot be more than 18 characters long."),
  description: yup
    .string()
    .optional()
    .max(128, "Description cannot be more than 128 characters long."),
  image: yup.string().nullable().url("Invalid image url."),
});

@InputType()
export class CreateForumInput {
  @Field({ nullable: false })
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({
    nullable: true,
  })
  image?: string;
}
