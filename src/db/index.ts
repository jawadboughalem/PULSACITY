import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }
  // DATABASE_URL points at the Supabase pooler in transaction mode, which
  // does not support prepared statements.
  const client = postgres(url, { prepare: false });
  return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDb>;

// One connection pool per server instance, kept across hot reloads in dev.
const globalForDb = globalThis as typeof globalThis & { pulsacityDb?: Database };

export function getDb(): Database {
  globalForDb.pulsacityDb ??= createDb();
  return globalForDb.pulsacityDb;
}
