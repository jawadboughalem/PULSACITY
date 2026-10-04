import type { MDXContent } from "mdx/types";

/** The two groups of /guides (m22). */
export type GuideGroup = "start" | "further";

export type Guide = {
  /** In the address: /guides/<slug>. */
  slug: string;
  group: GuideGroup;
  title: string;
  /** One line in the lists of guides. */
  summary: string;
  /** The search result's sentence, and the introduction of the guide. */
  description: string;
  /** YYYY-MM-DD, the day the text was last checked against the product. */
  updatedAt: string;
  readingMinutes: number;
  load: () => Promise<{ default: MDXContent }>;
};

export const GUIDE_GROUPS: Array<{ id: GuideGroup; title: string; text: string }> = [
  { id: "start", title: "Démarrer", text: "Pour vos premiers avis, dans l'ordre." },
  { id: "further", title: "Aller plus loin", text: "Quand votre espace tourne déjà." },
];

/** The guides of /guides, in the order of their group. Each text is an .mdx file of this folder. */
export const GUIDES: Guide[] = [
  {
    slug: "recolter-des-temoignages-clients-formation-en-ligne",
    group: "start",
    title: "Comment récolter des témoignages clients pour une formation en ligne",
    summary: "Quand demander, quoi demander, comment relancer une fois sans insister.",
    description:
      "Quand demander, quoi demander, comment relancer sans insister : une méthode concrète pour obtenir des témoignages qui aident vraiment à vendre votre formation.",
    updatedAt: "2026-10-04",
    readingMinutes: 7,
    load: () => import("./recolter-des-temoignages-clients-formation-en-ligne.mdx"),
  },
  {
    slug: "ajouter-des-temoignages-sur-une-page-systeme-io",
    group: "start",
    title: "Comment ajouter des témoignages sur une page Systeme.io",
    summary: "Trois façons d'afficher vos avis sur une page de vente, et où les placer.",
    description:
      "Les trois façons d'afficher des avis clients sur une page de vente Systeme.io, de la plus simple à la plus durable, avec les pièges à éviter.",
    updatedAt: "2026-10-04",
    readingMinutes: 6,
    load: () => import("./ajouter-des-temoignages-sur-une-page-systeme-io.mdx"),
  },
  {
    slug: "temoignages-clients-rgpd-formateur",
    group: "further",
    title: "Témoignages clients et RGPD : ce qu'un formateur doit savoir",
    summary: "Consentement, photo, durée de conservation : les règles pour publier les avis.",
    description:
      "Consentement, droit à l'image, demandes d'avis par e-mail, durée de conservation : les règles à connaître pour publier les avis de vos clients en toute sérénité.",
    updatedAt: "2026-10-04",
    readingMinutes: 7,
    load: () => import("./temoignages-clients-rgpd-formateur.mdx"),
  },
];

export const findGuide = (slug: string): Guide | null => GUIDES.find((guide) => guide.slug === slug) ?? null;
