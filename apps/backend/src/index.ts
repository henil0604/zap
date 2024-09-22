import { env } from "@/utils/env";
import { CONST } from "@/const";
import { logger } from "@/utils/logger";
import { baseElysia } from "./base";
import swagger from "@elysiajs/swagger";
import { AuthRoutes } from "@/routes/auth";

export const app = baseElysia({
  name: "zap",
  seed: "zap",
})
  .use(swagger())
  .use(AuthRoutes);

const port = env.getInt(CONST.ENV.BACKEND_PORT);

app.listen(port);

logger.success(`Server running at ${app.server?.port}`);
