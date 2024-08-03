import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";
import { CONST } from "@/const";
import { AuthRoute } from "@/routes/auth";

const app = new Hono();

app.route("/auth", AuthRoute);

const port = parseInt(env.get(CONST.ENV.BACKEND_PORT));

const server = serve({
  fetch: app.fetch,
  port,
});

server.once("listening", () => {
  logger.success("Server Listening on", port);
});
