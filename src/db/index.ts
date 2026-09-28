import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { MissingDatabaseUrlError } from "./missing-database-url-error";
import * as schema from "./schema";

const createDb = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new MissingDatabaseUrlError();
  const client = postgres(url, { prepare: false });
  return drizzle({ client, schema });
};

type PostgresDatabase = ReturnType<typeof createDb>;

const globalForDb = globalThis as typeof globalThis & { pulsacityDb?: PostgresDatabase };

export const getDb = (): PostgresDatabase => {
  globalForDb.pulsacityDb ??= createDb();
  return globalForDb.pulsacityDb;
};
