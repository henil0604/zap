import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "@zap/env";
import { logger } from "@zap/logger";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = parseInt(env.get("BACKEND_PORT"));

const server = serve({
  fetch: app.fetch,
  port,
});

server.once("listening", () => {
  logger.success("Server Listening on", port);
});
