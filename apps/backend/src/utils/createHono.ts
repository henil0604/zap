import { HonoVariables } from "@/types";
import { Hono } from "hono";

export function createHono() {
  return new Hono<{
    Variables: HonoVariables;
  }>();
}
