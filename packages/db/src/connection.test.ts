import { describe, expect, it } from 'vitest';

import { connectionOptions } from './connection';

describe('connectionOptions', () => {
  // Supabase leaves "Enforce SSL" optional and postgres.js defaults to clear text:
  // the guarantee has to live here.
  it.each([
    'postgresql://user:pw@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
    'postgresql://user:pw@db.abcdef.supabase.co:5432/postgres',
    'postgres://user:pw@some.host.example:5432/db',
  ])('requires TLS on %s', (url) => {
    expect(connectionOptions(url, {}).ssl).toBe('require');
  });

  it.each([
    'postgresql://postgres@localhost:5432/pulsacity',
    'postgresql://postgres@127.0.0.1:55432/pulsacity',
  ])('leaves loopback alone on %s', (url) => {
    expect(connectionOptions(url, {}).ssl).toBeUndefined();
  });

  it('never prepares statements: the transaction pooler refuses them', () => {
    expect(connectionOptions('postgres://h/d', {}).prepare).toBe(false);
  });

  it('keeps the caller’s own options', () => {
    const options = connectionOptions('postgres://h/d', { max: 1 });
    expect(options.max).toBe(1);
    expect(options.ssl).toBe('require');
  });

  // Failing closed: an unparseable url is not treated as local.
  it('still requires TLS when the url cannot be parsed', () => {
    expect(connectionOptions('pas-une-url', {}).ssl).toBe('require');
  });
});
