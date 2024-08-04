import { Hono } from "hono";
import { EmailBasedAuthRoute } from "@/routes/auth/email-based";
import { AuthService } from "@/services/auth";
import { createResponse } from "@/utils/createResponse";
import { CONST } from "@/const";

export const AuthRoute = createHono();

AuthRoute.route("/email", EmailBasedAuthRoute);

AuthRoute.get("/logout", async (c) => {
  AuthService.clearSessionCookie({
    context: c,
  });

  return c.json(
    createResponse(false, CONST.RESPONSE_CODES.OK, "Logout Successful")
  );
});
