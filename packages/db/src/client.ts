/**
 * Postgres connection.
 *
 * Supabase is reached through its **transaction** pooler, which does not support
 * prepared statements — hence `prepare: false`. The client is created lazily so that
 * importing this module (during a build, or in a test) never requires a database.
 */
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { connectionOptions } from './connection';
import * as schema from './schema';

export type Database = PostgresJsDatabase<typeof schema>;

let client: postgres.Sql | undefined;
let database: Database | undefined;

/** True when a connection string is configured. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Returns the shared Drizzle instance, creating it on first use. */
export function getDb(): Database {
  if (database) return database;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL est absente. Renseignez-la dans .env.local (voir .env.example).');
  }

  client = postgres(url, connectionOptions(url, { max: 5, idle_timeout: 20, connect_timeout: 10 }));
  database = drizzle(client, { schema });
  return database;
}

/** Closes the pool. Used by scripts (migrate, seed); the app keeps its pool warm. */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.end({ timeout: 5 });
    client = undefined;
    database = undefined;
  }
}

export { schema };
