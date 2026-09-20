/**
 * Describes a Postgres connection string without ever revealing its password.
 *
 * A `28P01` says the password was refused; it never says which password was sent.
 * When the string travels through a browser, a clipboard and a masked secret field,
 * what reaches the driver can differ from what was typed, and nobody can see it —
 * not the author, not the log, not the reader of the log. Every field below is a
 * fact about that difference, and every one is safe to print in a build log.
 *
 * The password checks mirror what postgres.js measurably does, which is narrower
 * than folklore suggests: it percent-decodes the password, so `@ : [ ] & + =` and
 * spaces typed raw all arrive intact, while `/ ? #` make `new URL` throw a
 * TypeError rather than an authentication error. What survives as a silent wrong
 * password is a short list, and it is the list below.
 */

/** What the driver will transmit, in terms that reveal none of it. */
export interface PasswordShape {
  readonly present: boolean;
  /** Still wrapped in the brackets of a `[YOUR-PASSWORD]` placeholder. */
  readonly bracketed: boolean;
  /** Still holds placeholder wording rather than a value. */
  readonly placeholder: boolean;
  /** Carries leading or trailing whitespace, which is transmitted as part of it. */
  readonly padded: boolean;
  /** Percent-decoding changed it, so a `%XX` sequence was consumed on the way out. */
  readonly decodedAway: boolean;
}

/** What the driver will connect to, once the string is parsed. */
export interface ConnectionTarget {
  readonly host: string;
  readonly port: string;
  readonly database: string;
  readonly user: string;
}

export type ConnectionUrlReport =
  | { readonly kind: 'empty' }
  | { readonly kind: 'unparsable' }
  | {
      readonly kind: 'parsed';
      readonly target: ConnectionTarget;
      readonly password: PasswordShape;
      readonly problems: readonly string[];
    };

const PLACEHOLDER =
  /your[-_ ]?password|votre[-_ ]?(mot[-_ ]?de[-_ ]?passe|mdp)|mot[-_ ]?de[-_ ]?passe|<password>/i;

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Reads the password out of the raw string rather than through `URL`, because `URL`
 * hands back a re-encoded value and so cannot say what was typed. postgres.js cuts
 * the authority at the first `?` or `/` and the userinfo at the last `:` before it.
 */
function typedPassword(url: string): string {
  const authority = url.slice(url.indexOf('://') + 3).split(/[?/]/)[0] ?? '';
  const lastAt = authority.lastIndexOf('@');
  if (lastAt === -1) return '';
  const userinfo = authority.slice(0, lastAt);
  const separator = userinfo.indexOf(':');
  return separator === -1 ? '' : userinfo.slice(separator + 1);
}

function describePassword(typed: string): PasswordShape {
  const transmitted = decode(typed);
  return {
    present: transmitted.length > 0,
    bracketed: /^\[.*]$/.test(transmitted),
    placeholder: PLACEHOLDER.test(transmitted),
    padded: transmitted !== transmitted.trim(),
    decodedAway: transmitted !== typed,
  };
}

/** Expectations specific to Supabase, stated as findings rather than assumptions. */
function targetProblems(target: ConnectionTarget): string[] {
  const problems: string[] = [];

  if (target.host.startsWith('db.') && target.host.endsWith('.supabase.co')) {
    problems.push(
      "L'hôte est la connexion directe, qui n'existe qu'en IPv6, alors qu'un runner GitHub est en IPv4. Prenez le pooler.",
    );
  }

  if (target.host.includes('pooler.supabase.com') && !/^postgres\.[a-z\d]+$/.test(target.user)) {
    problems.push(
      `Le pooler attend l'utilisateur « postgres.<ref-du-projet> » ; la chaîne porte « ${target.user} ».`,
    );
  }

  if (target.port === '6543') {
    problems.push(
      'Le port 6543 est le pooler de transactions : il refuse les instructions de session dont les migrations ont besoin. Prenez le port 5432.',
    );
  }

  return problems;
}

function passwordProblems(password: PasswordShape): string[] {
  const problems: string[] = [];

  if (!password.present) {
    problems.push('La chaîne ne porte aucun mot de passe.');
    return problems;
  }
  if (password.bracketed) {
    problems.push(
      'Le mot de passe est encore entre crochets : les « [ ] » du gabarit sont restés.',
    );
  }
  if (password.placeholder) {
    problems.push("Le mot de passe est resté le texte d'exemple, pas une valeur.");
  }
  if (password.padded) {
    problems.push('Le mot de passe commence ou finit par une espace, qui est transmise avec lui.');
  }
  if (password.decodedAway) {
    problems.push(
      "Le mot de passe contient une séquence « %XX » que le pilote décode avant de l'envoyer. Si ces caractères font partie du mot de passe, doublez le « % » en « %25 ».",
    );
  }

  return problems;
}

export function describeConnectionUrl(value: string): ConnectionUrlReport {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { kind: 'empty' };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { kind: 'unparsable' };
  }

  const target: ConnectionTarget = {
    host: parsed.hostname,
    port: parsed.port || '5432',
    database: parsed.pathname.replace(/^\//, ''),
    user: decode(parsed.username),
  };
  const password = describePassword(typedPassword(trimmed));

  return {
    kind: 'parsed',
    target,
    password,
    problems: [...targetProblems(target), ...passwordProblems(password)],
  };
}
