import type { FaqEntry } from "@/content/faq";
import { SITE_NAME } from "./page-metadata";

/** schema.org Organization of the home page. */
export const buildOrganizationData = (siteUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  description: "Vos ventes deviennent des témoignages, automatiquement.",
});

/** schema.org FAQPage: the questions as the page shows them, word for word. */
export const buildFaqPageData = (entries: FaqEntry[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: entries.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: entry.answer },
  })),
});

type BreadcrumbStep = { name: string; path?: string };

/** schema.org BreadcrumbList: the trail shown above a page's title, the home first; the page itself has no address. */
export const buildBreadcrumbData = (siteUrl: string, steps: BreadcrumbStep[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: steps.map((step, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: step.name,
    ...(step.path === undefined ? {} : { item: `${siteUrl}${step.path === "/" ? "" : step.path}` }),
  })),
});

type GuideArticle = { title: string; description: string; updatedAt: string; path: string };

/** schema.org Article of a guide: its title, its sentence, the day it was last checked, PULSACITY as its author. */
export const buildGuideData = (siteUrl: string, guide: GuideArticle) => {
  const organization = { "@type": "Organization", name: SITE_NAME, url: siteUrl };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updatedAt,
    inLanguage: "fr-FR",
    mainEntityOfPage: `${siteUrl}${guide.path}`,
    author: organization,
    publisher: { ...organization, logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png` } },
  };
};
