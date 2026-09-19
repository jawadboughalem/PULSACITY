/**
 * Host configuration, shared by the middleware, the pages and the tests.
 *
 * These two variables are `NEXT_PUBLIC_` on purpose: the middleware runs on the edge
 * and needs them inlined at build time.
 */
export const CORPORATE_HOST = (
  process.env.NEXT_PUBLIC_CORPORATE_HOST ?? 'pulsacity.com'
).toLowerCase();

export const DEMO_HOST = (process.env.NEXT_PUBLIC_DEMO_HOST ?? 'demo.pulsacity.com').toLowerCase();

/** Legacy domain kept for the paper trail: it permanently redirects to the .com. */
export const LEGACY_HOSTS = ['pulsacity.fr', 'www.pulsacity.fr'] as const;

/** `http` for local development hosts, `https` everywhere else. */
export function protocolFor(host: string): 'http' | 'https' {
  const name = host.split(':')[0] ?? '';
  return name === 'localhost' || name.endsWith('.localhost') || name === '127.0.0.1'
    ? 'http'
    : 'https';
}

export function originFor(host: string): string {
  return `${protocolFor(host)}://${host}`;
}

export function corporateOrigin(): string {
  return originFor(CORPORATE_HOST);
}

export function demoOrigin(): string {
  return originFor(DEMO_HOST);
}

/** Absolute URL on the corporate host, e.g. `corporateUrl('/cgv')`. */
export function corporateUrl(path = '/'): string {
  return new URL(path, `${corporateOrigin()}/`).toString();
}

/** Absolute URL of a demo, e.g. `demoUrl('as-du-2-roues')`. */
export function demoUrl(slug: string): string {
  return `${demoOrigin()}/${slug}`;
}
