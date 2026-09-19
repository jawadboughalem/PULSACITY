/**
 * Loads `.env.local`, then `.env`, from the repository root.
 *
 * The scripts run with their working directory inside `packages/db`, while the env
 * files live at the workspace root — hence the explicit resolution. Variables already
 * present in the environment win, so `DIRECT_DATABASE_URL=… pnpm db:migrate` keeps
 * overriding the file.
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

export function loadEnvFiles(): void {
  for (const name of ['.env.local', '.env']) {
    const path = join(repoRoot, name);
    if (!existsSync(path)) continue;
    try {
      process.loadEnvFile(path);
    } catch (error) {
      console.warn(`Lecture de ${name} impossible, variables ignorées.`, error);
    }
  }
}
