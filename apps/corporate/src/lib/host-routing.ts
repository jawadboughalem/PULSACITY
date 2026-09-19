/**
 * Host → target matrix.
 *
 * One pure function decides what every incoming host does, so the behaviour is
 * unit-testable and the middleware stays a thin adapter.
 *
 *   pulsacity.com            → corporate page
 *   www.pulsacity.com        → 308 to the apex
 *   pulsacity.fr / www.*.fr  → 301 to https://pulsacity.com, same path
 *   demo.pulsacity.com/<slug>→ rewrite to /_hosts/demo/<slug>  (always noindex)
 *   *.vercel.app             → corporate page (preview deployments)
 *   anything else            → looked up in `domains`; nothing in V0 → sober 404
 */
import { CORPORATE_HOST, DEMO_HOST, LEGACY_HOSTS, protocolFor } from './env';

/** Where the demo host is rewritten to. `%5F` in the folder name keeps the URL internal. */
export const DEMO_REWRITE_PREFIX = '/_hosts/demo';

export type HostRoute =
  /** Serve the corporate one-pager and its sub-pages. */
  | { kind: 'corporate' }
  /** Permanent redirect to another origin. */
  | { kind: 'redirect'; status: 301 | 308; location: string }
  /** Serve a demo. */
  | { kind: 'demo'; slug: string; rewriteTo: string }
  /** Demo host without a usable slug: « Cette démo n'est plus disponible ». */
  | { kind: 'demo-unavailable'; rewriteTo: string }
  /** Let the request through untouched (robots.txt, favicon, assets). */
  | { kind: 'passthrough' }
  /** Sober 404: unknown host, or a path that does not exist on this host. */
  | { kind: 'not-found' }
  /** Unknown host: the caller looks it up in `domains` before falling back to 404. */
  | { kind: 'lookup-domain'; host: string };

export interface HostRoutingConfig {
  corporateHost: string;
  demoHost: string;
  legacyHosts: readonly string[];
}

export const defaultHostRoutingConfig: HostRoutingConfig = {
  corporateHost: CORPORATE_HOST,
  demoHost: DEMO_HOST,
  legacyHosts: LEGACY_HOSTS,
};

/** A demo slug: lowercase, digits and dashes, as produced by the factory. */
export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,80}$/;

/** Paths the demo host serves itself rather than rewriting. */
const DEMO_PASSTHROUGH_PATHS = new Set(['/robots.txt', '/favicon.ico']);
/** Paths that must not exist on the demo host: it is never indexed. */
const DEMO_FORBIDDEN_PATHS = new Set(['/sitemap.xml']);

/** Lowercases, drops the FQDN trailing dot; the port is significant in development. */
export function normalizeHost(host: string | null | undefined): string {
  return (host ?? '').trim().toLowerCase().replace(/\.$/, '');
}

/** Vercel preview deployments serve the corporate page. */
function isPreviewHost(host: string): boolean {
  return host.endsWith('.vercel.app');
}

export function resolveHostRoute(
  request: { host: string | null | undefined; pathname: string; search?: string },
  config: HostRoutingConfig = defaultHostRoutingConfig,
): HostRoute {
  const host = normalizeHost(request.host);
  const pathname = request.pathname || '/';
  const search = request.search ?? '';

  if (!host) return { kind: 'not-found' };

  const corporateHost = normalizeHost(config.corporateHost);
  const demoHost = normalizeHost(config.demoHost);

  if (host === corporateHost) return { kind: 'corporate' };

  if (host === `www.${corporateHost}`) {
    return {
      kind: 'redirect',
      status: 308,
      location: `${protocolFor(corporateHost)}://${corporateHost}${pathname}${search}`,
    };
  }

  if (config.legacyHosts.some((legacy) => normalizeHost(legacy) === host)) {
    return {
      kind: 'redirect',
      status: 301,
      location: `${protocolFor(corporateHost)}://${corporateHost}${pathname}${search}`,
    };
  }

  if (host === demoHost) {
    if (DEMO_PASSTHROUGH_PATHS.has(pathname)) return { kind: 'passthrough' };
    if (DEMO_FORBIDDEN_PATHS.has(pathname)) return { kind: 'not-found' };

    const segments = pathname.split('/').filter(Boolean);
    const slug = segments[0];
    if (segments.length !== 1 || !slug || !SLUG_PATTERN.test(slug)) {
      return { kind: 'demo-unavailable', rewriteTo: DEMO_REWRITE_PREFIX };
    }
    return { kind: 'demo', slug, rewriteTo: `${DEMO_REWRITE_PREFIX}/${slug}` };
  }

  if (isPreviewHost(host)) return { kind: 'corporate' };

  return { kind: 'lookup-domain', host };
}
