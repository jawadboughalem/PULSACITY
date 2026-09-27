import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { MissingDatabaseUrlError } from "./missing-database-url-error";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new MissingDatabaseUrlError();
  const client = postgres(url, { prepare: false });
  return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDb>;

const globalForDb = globalThis as typeof globalThis & { pulsacityDb?: Database };

export function getDb(): Database {
  globalForDb.pulsacityDb ??= createDb();
  return globalForDb.pulsacityDb;
}
