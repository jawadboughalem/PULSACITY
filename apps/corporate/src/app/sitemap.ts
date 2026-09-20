import type { MetadataRoute } from 'next';

import { corporateUrl } from '@/lib/env';
import { liveLines } from '@/lib/lines';
import { loadSite } from '@/lib/site-content';

/** The corporate host only: demos are never indexed. Built from the content. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: corporateUrl('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    ...liveLines().map((line) => ({
      url: corporateUrl(`/${line.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: corporateUrl('/commander'), lastModified, changeFrequency: 'monthly', priority: 0.6 },
    ...loadSite().legalLinks.map((link) => ({
      url: corporateUrl(link.href),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    })),
  ];
}
