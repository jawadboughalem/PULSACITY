import { describeConnectionUrl } from './connection-url';

import { describe, expect, it } from 'vitest';

const POOLER = 'aws-1-eu-central-1.pooler.supabase.com';

function url(
  password: string,
  host = POOLER,
  port = '5432',
  user = 'postgres.abcdef123456',
): string {
  return `postgresql://${user}:${password}@${host}:${port}/postgres`;
}

function report(value: string) {
  const described = describeConnectionUrl(value);
  if (described.kind !== 'parsed')
    throw new Error(`attendu « parsed », reçu « ${described.kind} »`);
  return described;
}

describe('describeConnectionUrl', () => {
  it('reports an empty string as empty rather than guessing', () => {
    expect(describeConnectionUrl('').kind).toBe('empty');
    expect(describeConnectionUrl('   \n').kind).toBe('empty');
  });

  it('reports a string the driver cannot parse', () => {
    expect(describeConnectionUrl('pas-une-url').kind).toBe('unparsable');
  });

  it('reads the target the driver will reach', () => {
    const { target } = report(url('secret'));

    expect(target).toEqual({
      host: POOLER,
      port: '5432',
      database: 'postgres',
      user: 'postgres.abcdef123456',
    });
  });

  it('accepts a well-formed pooler string without complaint', () => {
    expect(report(url('aVerySecretValue')).problems).toEqual([]);
  });

  it('ignores whitespace around the whole string, which the parser strips anyway', () => {
    expect(report(`  ${url('secret')}\n`).problems).toEqual([]);
  });

  /*
   * postgres.js percent-decodes the password, so these characters reach the server
   * unchanged when typed raw. Flagging them would send the reader after a defect
   * that is not there.
   */
  it.each(['a@b', 'a:b', 'a&b', 'a+b', 'a=b', 'a b c', "a'b"])(
    'treats the raw character in %j as harmless',
    (password) => {
      expect(report(url(password)).problems).toEqual([]);
    },
  );

  it('names a password left inside its placeholder brackets', () => {
    const { password, problems } = report(url('[monMotDePasse]'));

    expect(password.bracketed).toBe(true);
    expect(problems).toContain(
      'Le mot de passe est encore entre crochets : les « [ ] » du gabarit sont restés.',
    );
  });

  it('names a password that is still the example text', () => {
    expect(report(url('YOUR-PASSWORD')).password.placeholder).toBe(true);
    expect(report(url('VOTRE-MOT-DE-PASSE')).password.placeholder).toBe(true);
  });

  it('names whitespace carried inside the password, which is transmitted with it', () => {
    const { password, problems } = report(url('secret%20'));

    expect(password.padded).toBe(true);
    expect(problems).toContain(
      'Le mot de passe commence ou finit par une espace, qui est transmise avec lui.',
    );
  });

  it('names a percent sequence the driver consumes before sending', () => {
    expect(report(url('a%40b')).password.decodedAway).toBe(true);
    expect(report(url('a@b')).password.decodedAway).toBe(false);
  });

  it('reports a missing password', () => {
    const { password, problems } = report(
      `postgresql://postgres.abcdef123456@${POOLER}:5432/postgres`,
    );

    expect(password.present).toBe(false);
    expect(problems).toContain('La chaîne ne porte aucun mot de passe.');
  });

  it('rejects the direct connection, which only answers on IPv6', () => {
    const { problems } = report(url('secret', 'db.abcdef123456.supabase.co'));

    expect(problems.some((problem) => problem.includes('IPv6'))).toBe(true);
  });

  it('rejects a pooler user without its project prefix', () => {
    const { problems } = report(url('secret', POOLER, '5432', 'postgres'));

    expect(problems.some((problem) => problem.includes('postgres.<ref-du-projet>'))).toBe(true);
  });

  it('rejects the transaction pooler, which cannot run migrations', () => {
    const { problems } = report(url('secret', POOLER, '6543'));

    expect(problems.some((problem) => problem.includes('6543'))).toBe(true);
  });

  it('never repeats the password in what it reports', () => {
    const secret = 'Tr0ub4dor-and-3';
    const described = JSON.stringify(describeConnectionUrl(url(secret)));

    expect(described).not.toContain(secret);
  });
});
