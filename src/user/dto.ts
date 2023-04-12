import { InputType, Field } from "type-graphql";
import * as yup from "yup";

export const registrationValidationSchema = yup.object({
  username: yup
    .string()
    .required("Username cannot be empty")
    .min(4, "Username should be atleast 4 characters long.")
    .max(18, "Username cannot be more than 18 characters long."),
  password: yup
    .string()
    .required("Password cannot be empty")
    .min(8, "Password should be atleast 8 characters long.")
    .max(32, "Password cannot be more than 32 characters long."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Confirm password cannot be empty"),
  description: yup
    .string()
    .optional()
    .default("")
    .max(128, "Description cannot be more than 128 characters long."),
});

@InputType()
export class UserRegistrationInput {
  @Field({ nullable: false })
  username!: string;

  @Field({ nullable: false })
  password!: string;

  @Field({ nullable: false })
  confirmPassword!: string;

  @Field({ nullable: true })
  description?: string;
}

export const loginValidationSchema = yup.object({
  username: yup.string().required("Username cannot be empty"),
  password: yup.string().required("Password cannot be empty"),
});

@InputType()
export class UserLoginInput {
  @Field({ nullable: false })
  username!: string;

  @Field({ nullable: false })
  password!: string;
}
