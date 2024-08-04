import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { LoginInputSchema, SignupInputSchema } from "./types";
import { AuthService } from "@/services/auth";
import { createResponse } from "@/utils/createResponse";
import { CONST } from "@/const";
import { hash } from "@/utils/crypto";
import { generateId } from "lucia";
import { ProviderId } from "@prisma/client";

export const EmailBasedAuthRoute = new Hono();

EmailBasedAuthRoute.post(
  "/signup",
  zValidator("json", SignupInputSchema),
  async (c) => {
    const data = c.req.valid("json");

    const user = await AuthService.getUserByEmail(data.email);

    const account = await AuthService.getAccountByEmailAndProviderId(
      data.email,
      ProviderId.Email
    );

    // if user has already signed up with email
    if (user && account) {
      return c.json(
        createResponse(
          true,
          CONST.RESPONSE_CODES.EXISTS,
          "Email is already Registered"
        )
      );
    }

    // if user has account but not with email
    if (user && !account) {
      await AuthService.createAccount({
        providerId: ProviderId.Email,
        providerUserId: user.id,
        userId: user.id,
      });
      return c.json(
        createResponse(false, CONST.RESPONSE_CODES.OK, "Account created", {
          userId: user.id,
        })
      );
    }

    const hashedPassword = hash(data.password);
    const userId = generateId(CONST.AUTH.USER_ID_LENGTH);

    await AuthService.createUser({
      id: userId,
      email: data.email,
      password: hashedPassword,
    });

    await AuthService.createAccount({
      providerId: ProviderId.Email,
      providerUserId: userId,
      userId,
    });

    return c.json(
      createResponse(false, CONST.RESPONSE_CODES.OK, "User created", {
        userId,
      })
    );
  }
);

EmailBasedAuthRoute.post(
  "/login",
  zValidator("json", LoginInputSchema),
  async (c) => {
    const data = c.req.valid("json");
    const session = c.var.session;

    if (session?.id) {
      await AuthService.invalidateSession(session.id);
    }

    const user = await AuthService.getUserByEmail(data.email);
    if (!user) {
      return c.json(
        createResponse(true, CONST.RESPONSE_CODES.NOT_FOUND, "Email not found")
      );
    }

    const account = await AuthService.getAccountByEmailAndProviderId(
      data.email,
      ProviderId.Email
    );
    if (!account) {
      return c.json(
        createResponse(
          true,
          CONST.RESPONSE_CODES.NOT_FOUND,
          "Email authentication not found"
        )
      );
    }

    const isValidPassword = AuthService.verifyPassword(
      user.password!,
      data.password
    );

    if (!isValidPassword) {
      return c.json(
        createResponse(true, CONST.RESPONSE_CODES.INVALID, "Invalid Password")
      );
    }

    await AuthService.createAndSetSessionCookie({
      context: c,
      providerId: ProviderId.Email,
      userId: user.id,
    });

    return c.json(
      createResponse(false, CONST.RESPONSE_CODES.OK, "Login Successful")
    );
  }
);
