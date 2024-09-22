import { createBaseElysia } from "@/base";
import { SignupInputSchema } from "./schema";

export const EmailBasedAuthRoutes = createBaseElysia({
  prefix: "/email",
}).post("/signup", (ctx) => {}, {
  body: SignupInputSchema,
});
