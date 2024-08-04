import * as ENV from "./env";
import * as AUTH from "./auth";

const RESPONSE_CODES = {
  EXISTS: "EXISTS",
  CREATED: "CREATED",
  NOT_FOUND: "NOT_FOUND",
  INVALID: "INVALID",
  OK: "OK",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;

export const CONST = {
  ENV,
  AUTH,
  RESPONSE_CODES,
} as const;
