import { defineConfig } from 'drizzle-kit';

/**
 * Migrations run against the direct Postgres connection (port 5432), not the
 * transaction pooler: drizzle-kit needs session-level statements the pooler refuses.
 */
const url = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || '';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
