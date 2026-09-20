/**
 * Applies pending Drizzle migrations.
 *
 * Uses the direct connection (port 5432) when one is configured: the transaction
 * pooler refuses the session-level statements migrations need.
 */
import { connectionOptions } from './connection';
import { loadEnvFiles } from './env';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

loadEnvFiles();

const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL (ou DIRECT_DATABASE_URL) est absente. Voir .env.example.');
  process.exit(1);
}

const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle');
const client = postgres(url, connectionOptions(url, { max: 1, onnotice: () => {} }));

try {
  await migrate(drizzle(client), { migrationsFolder });
  console.info('Migrations appliquées.');
} finally {
  await client.end({ timeout: 5 });
}
