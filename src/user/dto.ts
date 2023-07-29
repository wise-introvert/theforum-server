import { InputType, Field } from "type-graphql";
import * as yup from "yup";

export const registrationValidationSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .test("is-not-system-keyword", "Invalid username", (value: any): any => {
      // Add any additional checks for system keywords or restricted usernames
      const systemKeywords = ["admin", "root", "moderator", "superuser"];
      return !systemKeywords.includes(value.toLowerCase());
    })
    .required("Username is required"),
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
  email: yup
    .string()
    .required("email cannot be empty.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address."),
  description: yup
    .string()
    .optional()
    .default("")
    .max(128, "Description cannot be more than 128 characters long."),
  avatar: yup.string().notRequired().url("Invalid image url."),
});

@InputType()
export class UserRegistrationInput {
  @Field({ nullable: false })
  username!: string;

  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: false })
  password!: string;

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
