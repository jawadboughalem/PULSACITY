/**
 * Shown « Bientôt » on the Connecteurs page, with « Me prévenir »: the tools to come of the catalog
 * (docs-internes/decisions/connecteurs.md), in its order, with its sentences. Not in the registry: nothing receives
 * them yet, except through the universal connector.
 */
export const UPCOMING_CONNECTORS = [
  { id: "learnybox", name: "Learnybox", description: "Une demande d'avis après chaque vente ou inscription." },
  { id: "kajabi", name: "Kajabi", description: "Une demande d'avis après chaque achat d'une offre." },
  { id: "schoolmaker", name: "SchoolMaker", description: "Une demande d'avis quand un membre rejoint une offre." },
  { id: "podia", name: "Podia", description: "Une demande d'avis après chaque vente, avec Zapier." },
  { id: "calendly", name: "Calendly", description: "Une demande d'avis après chaque rendez-vous passé." },
  { id: "calcom", name: "Cal.com", description: "Une demande d'avis après chaque séance terminée." },
  { id: "stripe", name: "Stripe", description: "Une demande d'avis après chaque paiement réussi." },
  { id: "paypal", name: "PayPal", description: "Une demande d'avis après chaque paiement reçu." },
  {
    id: "livestorm",
    name: "Livestorm",
    description: "Une demande d'avis aux participants présents, après le webinaire.",
  },
  {
    id: "helloasso",
    name: "HelloAsso",
    description: "Une demande d'avis après chaque adhésion, billet ou paiement à votre association.",
  },
  { id: "weezevent", name: "Weezevent", description: "Une demande d'avis après l'événement, à chaque participant." },
  { id: "eventbrite", name: "Eventbrite", description: "Une demande d'avis après l'événement, à chaque participant." },
  { id: "woocommerce", name: "WooCommerce", description: "Une demande d'avis après chaque commande payée." },
  { id: "shopify", name: "Shopify", description: "Une demande d'avis après chaque commande payée." },
  {
    id: "zapier",
    name: "Zapier",
    description: "Reliez des milliers d'outils : une demande d'avis après chaque vente que vous choisissez.",
  },
  { id: "make", name: "Make", description: "Reliez des milliers d'outils, même avec le plan gratuit de Make." },
  {
    id: "n8n",
    name: "n8n",
    description: "Reliez n'importe quel outil avec n8n : une demande d'avis après chaque vente.",
  },
] as const;

export type UpcomingConnectorId = (typeof UPCOMING_CONNECTORS)[number]["id"];

export const UPCOMING_CONNECTOR_IDS = UPCOMING_CONNECTORS.map((connector) => connector.id) as [
  UpcomingConnectorId,
  ...UpcomingConnectorId[],
];

/** « Dites-nous quel outil »: the tool the creator names is kept under this id. */
export const OTHER_TOOL = "other";
