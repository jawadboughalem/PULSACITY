/**
 * Prints what the configured connection string will do, without printing the string.
 *
 * Runs before a migration so a refused password is diagnosed in one attempt rather
 * than guessed at over several: the secret is masked everywhere it appears, so the
 * only way to learn anything about it is to state facts derived from it.
 */
import { describeConnectionUrl } from './connection-url';
import { loadEnvFiles } from './env';

loadEnvFiles();

const variable = process.env.DIRECT_DATABASE_URL ? 'DIRECT_DATABASE_URL' : 'DATABASE_URL';
const report = describeConnectionUrl(process.env[variable] ?? '');

if (report.kind === 'empty') {
  console.error(`${variable} est vide. Voir .env.example.`);
  process.exit(1);
}

if (report.kind === 'unparsable') {
  console.error(
    `${variable} n'est pas une URL que le pilote sait lire. Un « / », un « ? » ou un « # » non encodé dans le mot de passe suffit à la casser : remplacez-les par %2F, %3F et %23.`,
  );
  process.exit(1);
}

const { target, password, problems } = report;

console.info(`Chaîne lue dans ${variable} :`);
console.info(`  hôte          ${target.host}`);
console.info(`  port          ${target.port}`);
console.info(`  base          ${target.database}`);
console.info(`  utilisateur   ${target.user}`);
console.info(`  mot de passe  ${password.present ? 'présent' : 'absent'}`);

if (problems.length === 0) {
  console.info('\nLa chaîne est bien formée. Un refus à ce stade vient du mot de passe lui-même.');
} else {
  console.error(`\n${problems.length} problème(s) :`);
  for (const problem of problems) console.error(`  — ${problem}`);
  process.exit(1);
}
