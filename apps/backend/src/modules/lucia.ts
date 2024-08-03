import { db } from "@/utils/db";
import { env } from "@/utils/env";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { ProviderId } from "@prisma/client";
import { Lucia } from "lucia";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env.getSafe("NODE_ENV", "production") === "production",
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
  providerId: ProviderId;
}
