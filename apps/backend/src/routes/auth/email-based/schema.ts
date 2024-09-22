import { t } from "elysia";

export const SignupInputSchema = t.Object({
  email: t.String(),
  password: t.String(),
});
