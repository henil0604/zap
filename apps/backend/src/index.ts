import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "@/utils/env";
import { logger } from "@/utils/logger";
import { CONST } from "@/const";
import { AuthRoute } from "@/routes/auth";
import { csrf } from "hono/csrf";
import { createHono } from "@/utils/createHono";
import { LuciaMiddleware } from "@/middlewares/auth";

const app = createHono();

app.use(csrf());
app.use("*", LuciaMiddleware());

app.route("/auth", AuthRoute);

const port = parseInt(env.get(CONST.ENV.BACKEND_PORT));

const server = serve({
  fetch: app.fetch,
  port,
});

server.once("listening", () => {
  logger.success("Server Listening on", port);
});
