import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Lazy initialization — do NOT throw at module load time.
// Vercel serverless functions crash if any top-level code throws,
// which would break even health-check endpoints.
// The DB is initialized on first use and cached for warm invocations.
let _pool: pg.Pool | null = null;
let _db: NodePgDatabase<typeof schema> | null = null;

function getPool(): pg.Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
      );
    }
    // Explicit ssl object prevents pg-connection-string from parsing
    // sslmode= out of the URL, which triggers a noisy Node.js deprecation
    // warning that Vercel logs as level:"error" and inflates error rate.
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("neon.tech") ||
           process.env.DATABASE_URL.includes("supabase") ||
           process.env.DATABASE_URL.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : false,
    });
  }
  return _pool;
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

// Convenience proxy — existing code that imports `db` directly still works.
// Access is lazy: the Pool/Drizzle instance is created on first property read.
export const pool = new Proxy({} as pg.Pool, {
  get(_t, prop) {
    return (getPool() as any)[prop];
  },
});

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_t, prop) {
    return (getDb() as any)[prop];
  },
});

export * from "./schema";
