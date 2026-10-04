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
