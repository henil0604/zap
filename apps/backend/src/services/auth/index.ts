import { lucia } from "@/modules/lucia";
import { hash } from "@/utils/crypto";
import { db } from "@/utils/db";
import { env } from "@/utils/env";
import { ProviderId, User } from "@prisma/client";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import { Cookie, RegisteredDatabaseSessionAttributes } from "lucia";

type CreateUserData = {
  id: string;
  email: string;
  password: string;
};
async function createUser(data: CreateUserData) {
  return await db.user.create({
    data: {
      email: data.email,
      password: data.password,
      id: data.id,
    },
  });
}

type CreateAccountData = {
  providerId: ProviderId;
  providerUserId: string;
  userId: string;
};
async function createAccount(data: CreateAccountData) {
  return await db.account.create({
    data: {
      providerId: data.providerId,
      providerUserId: data.providerUserId,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
  });
}

async function getAccountByEmailAndProviderId(
  email: string,
  providerId: ProviderId
) {
  return await db.account.findFirst({
    where: {
      user: {
        email: email,
      },
      providerId: providerId,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
    include: {
      accounts: true,
    },
  });
}

function verifyPassword(hashed: string, input: string) {
  return hash(input) === hashed;
}

async function createSessionCookie(
  userId: string,
  attributes: RegisteredDatabaseSessionAttributes
) {
  // create session
  const session = await lucia.createSession(userId, attributes);
  // create cookie from session
  const sessionCookie = lucia.createSessionCookie(session.id);

  return {
    session,
    cookie: sessionCookie,
  };
}

type SetSessionCookieData = {
  context: Context;
  cookie: Cookie;
  attributes?: Partial<CookieOptions>;
};
function setSessionCookie(data: SetSessionCookieData) {
  return setCookie(data.context, data.cookie.name, data.cookie.value, {
    path: ".",
    ...data.cookie.attributes,
    ...data.attributes,
  });
}

type CreateAndSetSessionCookieData = {
  userId: string;
  providerId: ProviderId;
  context: Context;
};
async function createAndSetSessionCookie(data: CreateAndSetSessionCookieData) {
  const { cookie: sessionCookie } = await AuthService.createSessionCookie(
    data.userId,
    {
      providerId: data.providerId,
    }
  );

  AuthService.setSessionCookie({
    context: data.context,
    cookie: sessionCookie,
  });

  return {
    cookie: sessionCookie,
  };
}

type ClearSessionCookieData = {
  context: Context;
};
function clearSessionCookie(data: ClearSessionCookieData) {
  AuthService.setSessionCookie({
    context: data.context,
    cookie: lucia.createBlankSessionCookie(),
    attributes: AuthService.generateCookieSetOptions(),
  });
}

interface CookieSetOptions {
  path: string;
  secure: boolean;
  httpOnly: boolean;
  maxAge: number;
  sameSite: "lax";
}
function generateCookieSetOptions(path = "/"): CookieSetOptions {
  return {
    httpOnly: true,
    path: path,
    maxAge: 10 * 60,
    sameSite: "lax",
    secure: env.getSafe("NODE_ENV", "production") === "production",
  };
}

export const AuthService = {
  createUser,
  getUserByEmail,
  verifyPassword,
  createAccount,
  getAccountByEmailAndProviderId,
  createSessionCookie,
  createAndSetSessionCookie,
  setSessionCookie,
  clearSessionCookie,
  generateCookieSetOptions,
};
