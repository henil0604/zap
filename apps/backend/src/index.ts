import { Elysia } from "elysia";
import { env } from "@/utils/env";
import { CONST } from "@/const";
import { logger } from "@/utils/logger";

const app = new Elysia().get("/", () => "Hello Elysia");

const port = env.getInt(CONST.ENV.BACKEND_PORT);

app.listen(port);

logger.success(`Server running at ${app.server?.hostname}:${app.server?.port}`);
