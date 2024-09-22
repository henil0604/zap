import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "@/modules/db";
import { env } from "@/utils/env";

const NODE_ENV = env.getSafe("NODE_ENV", "production");

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: NODE_ENV !== "development",
    },
  },
  getSessionAttributes(attributes) {
    return {
      providerId: attributes.providerId,
    };
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}

interface DatabaseSessionAttributes {
  providerId: string;
}
