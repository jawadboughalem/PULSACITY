import { PLANS } from "@/config/plans";
import {
  CUSTOMERS_DISTURBED,
  FIRST_TESTIMONIAL_DELAY,
  type FaqEntry,
  GDPR,
  NOT_TECHNICAL,
  REQUEST_TIMING,
  RESIGN,
  SITE_COMPATIBILITY,
  TOOL_NOT_LISTED,
  VAT,
  WIDGET_SAFE,
} from "./faq";

/** A theme of /aide: its questions, then the guide that goes further (maquette 8.4). */
export type HelpTheme = {
  /** The anchor of the theme: /aide#connecteurs. */
  id: string;
  title: string;
  entries: FaqEntry[];
  guideSlug?: string;
};

const { free, essentiel } = PLANS;

/**
 * The questions of /aide, by theme, in the order of 8.4. The answers of the home page and of the prices are the same
 * words; the others come from decisions/positionnement.md (« Vos questions ») and from what the product does today.
 */
export const HELP_THEMES: HelpTheme[] = [
  {
    id: "demarrer",
    title: "Démarrer",
    entries: [
      NOT_TECHNICAL,
      FIRST_TESTIMONIAL_DELAY,
    ],
    guideSlug: "recolter-des-temoignages-clients-formation-en-ligne",
  },
  {
    id: "connecteurs",
    title: "Connecteurs",
    entries: [
      TOOL_NOT_LISTED,
      {
        question: "Que veut dire « Bientôt » ?",
        answer:
          "Le connecteur est prévu, sans date promise : nous le construisons à partir de vraies ventes de test. En attendant, votre outil se relie avec Zapier ou Make. « Me prévenir », sur sa page, vous écrit une seule fois, le jour de sa sortie.",
      },
    ],
    guideSlug: "envoyer-vos-ventes-avec-zapier",
  },
  {
    id: "demandes",
    title: "Demandes",
    entries: [
      REQUEST_TIMING,
      CUSTOMERS_DISTURBED,
    ],
  },
  {
    id: "widgets",
    title: "Widgets",
    entries: [
      SITE_COMPATIBILITY,
      WIDGET_SAFE,
    ],
    guideSlug: "ajouter-des-temoignages-sur-une-page-systeme-io",
  },
  {
    id: "abonnement",
    title: "Abonnement",
    entries: [
      VAT,
      {
        question: "Que se passe-t-il si je dépasse une limite ?",
        answer: `Rien n'est supprimé. Au plan ${free.name}, au-delà de ${free.limits.testimonials} témoignages validés, les nouveaux attendent dans votre espace. Au-delà de ${free.limits.monthlyRequests} demandes dans le mois, les suivantes partent le 1er du mois suivant. Le plan ${essentiel.name} lève ces limites.`,
      },
      RESIGN,
    ],
  },
  {
    id: "donnees-personnelles",
    title: "Données personnelles",
    entries: [
      GDPR,
      {
        question: "Puis-je exporter ou supprimer mes données ?",
        answer:
          "Oui, depuis Mon compte. « Exporter mes données » prépare un fichier avec votre espace, vos offres, vos clients et vos témoignages. « Supprimer mon espace » efface tout, immédiatement et définitivement.",
      },
    ],
    guideSlug: "temoignages-clients-rgpd-formateur",
  },
];
