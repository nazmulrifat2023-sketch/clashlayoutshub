// This file is the Vercel serverless entry point.
// The Express app is pre-bundled by esbuild (build:vercel) to avoid
// Vercel having to resolve TypeScript workspace package references.
// @ts-ignore — importing pre-built ESM bundle; types not needed here
import app from "../artifacts/api-server/dist/app.mjs";

export default app;
