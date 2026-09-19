import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

import { CORPORATE_HOST, corporateUrl } from '@/lib/env';
import { normalizeHost } from '@/lib/host-routing';

/**
 * Only `pulsacity.com` is indexable. The demo host and every preview deployment
 * answer with a blanket disallow (CLAUDE.md rule 8).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = normalizeHost((await headers()).get('host'));

  if (host !== CORPORATE_HOST) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/merci', '/_hosts/'] }],
    sitemap: corporateUrl('/sitemap.xml'),
    host: corporateUrl('/'),
  };
}
