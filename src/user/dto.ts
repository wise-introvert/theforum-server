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
    .max(32, "Password cannot be more than 32 characters long.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#]/,
      "Password must contain at least one of the following special characters: !, @, #"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Confirm password cannot be empty"),
  description: yup
    .string()
    .optional()
    .default("")
    .max(128, "Description cannot be more than 128 characters long."),
  image: yup.string().nullable().url("Invalid image url."),
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

  @Field({ nullable: true })
  avatar?: string;
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
