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
} catch (error) {
  if (isAuthenticationFailure(error)) {
    console.error(
      [
        'Le serveur a refusé le mot de passe (28P01). La chaîne a atteint le bon projet :',
        "c'est la valeur du mot de passe qui ne correspond pas. Trois causes, dans cet ordre :",
        '',
        "  1. Le mot de passe n'est pas celui que vous croyez — une réinitialisation Supabase",
        "     qui n'a pas abouti laisse l'ancien en place.",
        '  2. Des crochets ou une espace sont restés autour de la valeur au collage.',
        "  3. Le mot de passe contient « %XX », que le pilote décode avant de l'envoyer.",
        '',
        'Lancez `pnpm db:check-url` : il nomme les cas 2 et 3 sans révéler le mot de passe.',
      ].join('\n'),
    );
  }
  throw error;
} finally {
  await client.end({ timeout: 5 });
}

/** Postgres answers `28P01` whenever it rejects the credentials it was given. */
function isAuthenticationFailure(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '28P01';
}
