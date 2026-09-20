/**
 * Connection options shared by the application pool and the migration scripts.
 *
 * Two things must hold everywhere a connection is opened, so they are decided here
 * rather than repeated at each call site.
 */
import type { Options, PostgresType } from 'postgres';

/** Loopback traffic never leaves the machine; anything else crosses the internet. */
function isLoopback(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch {
    return false;
  }
}

export function connectionOptions<T extends Record<string, PostgresType>>(
  url: string,
  extra: Options<T>,
): Options<T> {
  return {
    // The Supabase transaction pooler does not support prepared statements.
    prepare: false,
    /*
     * postgres.js opens a plaintext connection unless told otherwise, and Supabase
     * leaves "Enforce SSL" as an optional dashboard toggle. Requiring TLS here puts
     * the guarantee in code, where it cannot be forgotten.
     *
     * `require` encrypts without verifying the certificate chain. Verification needs
     * Supabase's CA bundle; until that is wired, this is strictly better than clear
     * text and cannot break on a certificate the runtime does not trust.
     */
    ...(isLoopback(url) ? {} : { ssl: 'require' as const }),
    ...extra,
  };
}
