import { EmailBasedAuthRoute } from "@/routes/auth/email-based";
import { AuthService } from "@/services/auth";
import { createResponse } from "@/utils/createResponse";
import { CONST } from "@/const";
import { createHono } from "@/utils/createHono";
import { PrivateRouteMiddleware } from "@/middlewares/auth";

export const AuthRoute = createHono();

AuthRoute.route("/email", EmailBasedAuthRoute);

AuthRoute.get("/session", PrivateRouteMiddleware(), async (c) => {
  const user = c.var.user;

  return c.json(
    createResponse(false, CONST.RESPONSE_CODES.OK, "Session found", user),
    200
  );
});

AuthRoute.post("/logout", PrivateRouteMiddleware(), async (c) => {
  const sessionId = c.var.session.id;

  await AuthService.invalidateSession(sessionId);

  AuthService.clearSessionCookie({
    context: c,
  });

  return c.json(
    createResponse(false, CONST.RESPONSE_CODES.OK, "Logout Successful"),
    200
  );
});
