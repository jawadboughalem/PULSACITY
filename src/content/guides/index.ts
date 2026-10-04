import type { MDXContent } from "mdx/types";

export type Guide = {
  /** In the address: /guides/<slug>. */
  slug: string;
  title: string;
  /** The search result's sentence, and the line under the title. */
  description: string;
  /** YYYY-MM-DD, the day the text was last checked against the product. */
  updatedAt: string;
  readingMinutes: number;
  load: () => Promise<{ default: MDXContent }>;
};

/** The guides of /guides, newest first. Each text is an .mdx file of this folder. */
export const GUIDES: Guide[] = [
  {
    slug: "ajouter-des-temoignages-sur-une-page-systeme-io",
    title: "Comment ajouter des témoignages sur une page Systeme.io",
    description:
      "Les trois façons d'afficher des avis clients sur une page de vente Systeme.io, de la plus simple à la plus durable, avec les pièges à éviter.",
    updatedAt: "2026-10-04",
    readingMinutes: 6,
    load: () => import("./ajouter-des-temoignages-sur-une-page-systeme-io.mdx"),
  },
  {
    slug: "recolter-des-temoignages-clients-formation-en-ligne",
    title: "Comment récolter des témoignages clients pour une formation en ligne",
    description:
      "Quand demander, quoi demander, comment relancer sans insister : une méthode concrète pour obtenir des témoignages qui aident vraiment à vendre votre formation.",
    updatedAt: "2026-10-04",
    readingMinutes: 7,
    load: () => import("./recolter-des-temoignages-clients-formation-en-ligne.mdx"),
  },
  {
    slug: "temoignages-clients-rgpd-formateur",
    title: "Témoignages clients et RGPD : ce qu'un formateur doit savoir",
    description:
      "Consentement, droit à l'image, demandes d'avis par e-mail, durée de conservation : les règles à connaître pour publier les avis de vos clients en toute sérénité.",
    updatedAt: "2026-10-04",
    readingMinutes: 7,
    load: () => import("./temoignages-clients-rgpd-formateur.mdx"),
  },
];

export const findGuide = (slug: string): Guide | null => GUIDES.find((guide) => guide.slug === slug) ?? null;
