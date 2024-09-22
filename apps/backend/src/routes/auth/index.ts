import { createBaseElysia } from "@/base";
import { EmailBasedAuthRoutes } from "./email-based/email";

export const AuthRoutes = createBaseElysia({
  prefix: "/auth",
}).use(EmailBasedAuthRoutes);
