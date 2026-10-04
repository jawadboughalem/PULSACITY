import type { MetadataRoute } from "next";
import { MARKETING_PATHS, guidePath, integrationPath } from "@/components/marketing/marketing-paths";
import { GUIDES } from "@/content/guides";
import { INTEGRATIONS } from "@/content/integrations";
import { isLegalValidated } from "@/lib/legal/is-legal-validated";
import { readSiteUrl } from "@/lib/site-url";

const LEGAL_PATHS = [
  MARKETING_PATHS.legalNotice,
  MARKETING_PATHS.terms,
  MARKETING_PATHS.salesTerms,
  MARKETING_PATHS.privacy,
];

/** The public pages only. The legal texts join once validated: until then, they ask not to be indexed. */
const sitemap = (): MetadataRoute.Sitemap => {
  const siteUrl = readSiteUrl();
  const page = (path: string, priority: number, lastModified?: string) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
  });
  return [
    page(MARKETING_PATHS.home, 1),
    page(MARKETING_PATHS.pricing, 0.8),
    page(MARKETING_PATHS.integrations, 0.7),
    ...INTEGRATIONS.map((integration) =>
      page(integrationPath(integration.slug), integration.status === "available" ? 0.9 : 0.5),
    ),
    page(MARKETING_PATHS.guides, 0.6),
    ...GUIDES.map((guide) => page(guidePath(guide.slug), 0.7, guide.updatedAt)),
    ...(isLegalValidated() ? LEGAL_PATHS.map((path) => page(path, 0.2)) : []),
  ];
};

export default sitemap;
