import { z } from "zod";

const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/;
export const registerSchema = z.object({
  email: z
    .string("email is required.")
    .min(1, "email is required.")
    .email({ message: "Invalid email address" })
    .trim()
    .refine(
      (value) => {
        return value.endsWith("@email.com") || value.endsWith("@gmail.com");
      },
      {
        message: "Email must end with @email.com or @gmail.com",
      }
    ),
  name: z
    .string("name is required.")
    .min(4, "Please enter minimum 4 character name"),
  password: z
    .string("password is required.")
    .min(8, "password must be of 8 character minimum.")
    .regex(passwordValidation, {
      message:
        "Your password is not valid. Please provide valid passowrd with pattern one uppercase , lowercase , number & symbole",
    }),
});
export const LoginSchema = z.object({
  email: z
    .string("email is required.")
    .email({ message: "Invalid email address" })
    .trim(),
  password: z
    .string("password must be of 8 character minimum.")
    .min(8, "password must be of 8 character minimum.")
    .regex(passwordValidation, {
      message: "Invalid Credentials",
    }),
});
export const BlogSchema = z.object({
  title: z
    .string("title is required.")
    .min(6, "title must be of 6 character minimum"),
  description: z
    .string("desciption is required")
    .min(10, "description must be of 10 character minimum"),
});

export const nameschema = z
  .string("name is required.")
  .min(4, "Please enter minimum 4 character name");
export const passwordschema = z
  .string("password is required.")
  .min(8, "password must be of 8 character minimum.")
  .regex(passwordValidation, {
    message:
      "Your password is not valid. Please provide valid passowrd with pattern one uppercase , lowercase , number & symbole",
  });
