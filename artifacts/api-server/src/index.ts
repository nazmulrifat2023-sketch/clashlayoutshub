// Load .env.local in development (no-op if file absent or on Replit with Secrets)
import { config as loadEnv } from "dotenv";
import { resolve } from "path";
if (process.env.NODE_ENV !== "production") {
  // Look for .env.local two directories up (workspace root) and in the local dir
  loadEnv({ path: resolve(process.cwd(), "../../.env.local"), override: false });
  loadEnv({ path: resolve(process.cwd(), ".env.local"), override: false });
}

import app from "./app.js";
import { logger } from "./lib/logger.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
