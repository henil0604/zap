import { lucia } from "@/modules/lucia";
import { Session, User } from "lucia";
import Elysia, { t } from "elysia";
import { UnauthorizedException } from "@/const/errors/UnauthorizedException";

export type AuthStore = {
  user: User | null;
  session: Session | null;
};

declare module "elysia" {
  interface Store {
    auth: AuthStore;
  }
}

export const LuciaMiddleware = new Elysia({
  name: "Middleware.Lucia",
})
  .guard({
    cookie: t.Object({
      [lucia.sessionCookieName]: t.Optional(t.String()),
    }),
  })
  .resolve(
    { as: "scoped" },
    async (ctx): Promise<{ user: User | null; session: Session | null }> => {
      const sessionId = ctx.cookie[lucia.sessionCookieName];

      if (!sessionId || !sessionId.value) {
        return {
          user: null,
          session: null,
        };
      }

      const { session, user } = await lucia.validateSession(sessionId.value);

      if (!session || !user) {
        return {
          user: null,
          session: null,
        };
      }

      return {
        user: user,
        session: session,
      };
    }
  );

export const PrivateRoute = new Elysia({
  name: "Middleware.PrivateRoute",
})
  .use(LuciaMiddleware)
  .resolve({ as: "scoped" }, async (ctx) => {
    if (!ctx.user || !ctx.session) {
      throw new UnauthorizedException();
    }

    return {
      user: ctx.user,
      session: ctx.session,
    };
  });
