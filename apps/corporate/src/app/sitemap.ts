import type { MetadataRoute } from 'next';

import { corporateUrl } from '@/lib/env';

/** The corporate host only: demos are never indexed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: corporateUrl('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    {
      url: corporateUrl('/mentions-legales'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: corporateUrl('/confidentialite'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    { url: corporateUrl('/cgv'), lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
