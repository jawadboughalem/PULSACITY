import type { MDXContent } from "mdx/types";

/** The groups of /guides (m22), and the tools that send their sales to the universal connector. */
export type GuideGroup = "start" | "connect" | "further";

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
  { id: "connect", title: "Relier vos outils", text: "Quand votre outil n'a pas encore son connecteur : avec Zapier, Make ou n8n." },
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
    updatedAt: "2026-10-20",
    readingMinutes: 6,
    load: () => import("./ajouter-des-temoignages-sur-une-page-systeme-io.mdx"),
  },
  {
    slug: "envoyer-vos-ventes-avec-make",
    group: "connect",
    title: "Envoyer vos ventes avec Make",
    summary: "Un scénario Make, même avec le plan gratuit, envoie chaque vente au connecteur universel.",
    description:
      "Votre outil n'a pas encore son connecteur ? Avec Make, même gratuit, chaque vente part vers PULSACITY et déclenche une demande d'avis à votre nom.",
    updatedAt: "2026-10-13",
    readingMinutes: 4,
    load: () => import("./envoyer-vos-ventes-avec-make.mdx"),
  },
  {
    slug: "envoyer-vos-ventes-avec-zapier",
    group: "connect",
    title: "Envoyer vos ventes avec Zapier",
    summary: "Un Zap et son étape Webhooks by Zapier envoient chaque vente au connecteur universel.",
    description:
      "Votre outil n'a pas encore son connecteur ? Avec un Zap, chaque vente part vers PULSACITY et déclenche une demande d'avis à votre nom.",
    updatedAt: "2026-10-12",
    readingMinutes: 3,
    load: () => import("./envoyer-vos-ventes-avec-zapier.mdx"),
  },
  {
    slug: "envoyer-vos-ventes-avec-n8n",
    group: "connect",
    title: "Envoyer vos ventes avec n8n",
    summary: "Un nœud HTTP Request envoie chaque vente au connecteur universel, sur n8n Cloud ou chez vous.",
    description:
      "Votre outil n'a pas encore son connecteur ? Avec un workflow n8n, chaque vente part vers PULSACITY et déclenche une demande d'avis à votre nom.",
    updatedAt: "2026-10-13",
    readingMinutes: 3,
    load: () => import("./envoyer-vos-ventes-avec-n8n.mdx"),
  },
  {
    slug: "envoyer-vos-ventes-podia-avec-zapier",
    group: "connect",
    title: "Envoyer vos ventes Podia avec Zapier",
    summary: "Un Zap envoie chaque inscription à un produit Podia au connecteur universel.",
    description:
      "Podia n'a pas encore son connecteur. Avec un Zap, chaque inscription à un produit Podia déclenche dès aujourd'hui une demande d'avis à votre nom.",
    updatedAt: "2026-10-12",
    readingMinutes: 3,
    load: () => import("./envoyer-vos-ventes-podia-avec-zapier.mdx"),
  },
  {
    slug: "temoignages-clients-rgpd-formateur",
    group: "further",
    title: "Témoignages clients et RGPD : ce qu'un formateur doit savoir",
    summary: "Consentement, photo, durée de conservation : les règles pour publier les avis.",
    description:
      "Consentement, droit à l'image, demandes d'avis par e-⁠mail, durée de conservation : les règles à connaître pour publier les avis de vos clients en toute sérénité.",
    updatedAt: "2026-10-19",
    readingMinutes: 7,
    load: () => import("./temoignages-clients-rgpd-formateur.mdx"),
  },
];

export const findGuide = (slug: string): Guide | null => GUIDES.find((guide) => guide.slug === slug) ?? null;
