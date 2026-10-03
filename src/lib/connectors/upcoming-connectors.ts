/** Shown « Bientôt » on the Connecteurs page, with « Me prévenir ». Not in the registry: nothing receives them yet. */
export const UPCOMING_CONNECTORS = [
  { id: "stripe", name: "Stripe", description: "Paiements en ligne : une demande d'avis après chaque paiement réussi." },
  { id: "calendly", name: "Calendly", description: "Rendez-vous : une demande d'avis après chaque séance réalisée." },
] as const;

export type UpcomingConnectorId = (typeof UPCOMING_CONNECTORS)[number]["id"];

export const UPCOMING_CONNECTOR_IDS = UPCOMING_CONNECTORS.map((connector) => connector.id) as [
  UpcomingConnectorId,
  ...UpcomingConnectorId[],
];

/** « Dites-nous quel outil »: the tool the creator names is kept under this id. */
export const OTHER_TOOL = "other";
