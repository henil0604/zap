import { CONST } from "@/const";
import { lucia } from "@/modules/lucia";
import { AuthService } from "@/services/auth";
import { HonoVariables } from "@/types";
import { createResponse } from "@/utils/createResponse";
import { MiddlewareHandler } from "hono";

export const LuciaMiddleware = (): MiddlewareHandler<{
  Variables: HonoVariables;
}> => {
  return async (c, next) => {
    const sessionId = AuthService.getSessionId(c);
    if (!sessionId) {
      c.set("user", null);
      c.set("session", null);
      return next();
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        {
          append: true,
        }
      );
    }
    if (!session) {
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    }
    c.set("user", user);
    c.set("session", session);
    return next();
  };
};

export const PrivateRouteMiddleware = (): MiddlewareHandler<{
  Variables: HonoVariables & {
    user: NonNullable<HonoVariables["user"]>;
    session: NonNullable<HonoVariables["session"]>;
  };
}> => {
  return async (c, next) => {
    if (!c.var.user || !c.var.session) {
      return c.json(
        createResponse(true, CONST.RESPONSE_CODES.UNAUTHORIZED, "Unauthorized"),
        401
      );
    }

    c.set("user", c.var.user);
    c.set("session", c.var.session);

    return next();
  };
};
