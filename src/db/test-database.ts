import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { is, sql } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import type { Database } from "./database";
import * as schema from "./schema";

const MIGRATIONS_FOLDER = fileURLToPath(new URL("./migrations", import.meta.url));

const TABLE_NAMES = Object.values(schema)
  .filter((value) => is(value, PgTable))
  .map((table) => `"${getTableConfig(table).name}"`);

export const createTestDatabase = async (): Promise<Database> => {
  const database = drizzle({ client: new PGlite(), schema });
  await migrate(database, { migrationsFolder: MIGRATIONS_FOLDER });
  return database;
};

export const emptyTestDatabase = async (database: Database) => {
  await database.execute(sql.raw(`truncate table ${TABLE_NAMES.join(", ")} cascade`));
};
