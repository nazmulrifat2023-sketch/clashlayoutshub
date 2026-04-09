import pino from "pino";

// Use pino-pretty ONLY when explicitly enabled (local dev with the
// non-bundled dev server). The Vercel/production bundle runs with plain
// JSON output — pino-pretty uses worker threads that can't work inside a
// single-file esbuild bundle.
const usePretty =
  process.env.NODE_ENV !== "production" &&
  process.env.PINO_PRETTY !== "false" &&
  // Extra guard: if we're inside a bundled file the pino-pretty worker
  // would fail with "unable to determine transport target". Detect the
  // bundle by checking whether pino-pretty is resolvable as a real file.
  (() => {
    try {
      require.resolve("pino-pretty");
      return true;
    } catch {
      return false;
    }
  })();

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(usePretty
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
});
