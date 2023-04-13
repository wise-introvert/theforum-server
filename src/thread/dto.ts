import { InputType, Field } from "type-graphql";
import * as yup from "yup";

export const createThreadValidationSchema = yup.object({
  title: yup
    .string()
    .required("Thread's title cannot be empty")
    .min(4, "Thread's title should be atleast 4 characters long.")
    .max(18, "Thread's title cannot be more than 18 characters long."),
  author: yup.string().required("author cannot be empty"),
  forum: yup
    .string()
    .required("Thread cannot be created without a parent forum!"),
  genisis: yup
    .string()
    .required("Thread cannot be created without a genisis post!"),
  description: yup
    .string()
    .optional()
    .max(128, "Description cannot be more than 128 characters long."),
  image: yup.string().nullable().url("Invalid image url."),
});

@InputType()
export class CreateThreadInput {
  @Field({ nullable: false })
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({
    nullable: true,
  })
  image?: string;

  @Field({ nullable: false })
  author!: string;

  @Field({ nullable: false })
  genisis!: string;

  @Field({ nullable: false })
  forum!: string;
}
