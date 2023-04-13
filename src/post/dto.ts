import { InputType, Field } from "type-graphql";
import * as yup from "yup";

export const createPostValidationSchema = yup.object({
  title: yup
    .string()
    .required("Post's title cannot be empty")
    .min(4, "Post's title should be atleast 4 characters long.")
    .max(18, "Post's title cannot be more than 18 characters long."),
  author: yup.string().required("author cannot be empty"),
  forum: yup.string().required("forum cannot be empty"),
  genisis: yup.boolean().optional(),
  content: yup
    .string()
    .required("Content cannot be empty")
    .max(320, "Content cannot be more than 128 characters long."),
});

@InputType()
export class CreatePostInput {
  @Field({ nullable: false })
  title!: string;

  @Field({ nullable: false })
  content!: string;

  @Field({ nullable: false })
  author!: string;

  @Field({ nullable: false })
  forum!: string;

  @Field({ nullable: true })
  genisis?: boolean;
}
