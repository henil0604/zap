import { z } from "zod";

export const SignupInputSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const LoginInputSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid Email" }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const ProfileInputHeaderSchema = z.object({
  authorization: z.string({
    required_error: "Authorization header is required",
  }),
});
