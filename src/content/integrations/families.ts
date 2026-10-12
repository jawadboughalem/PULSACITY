/**
 * The families of the catalog, in their order of display, with their sentence (docs-internes/decisions/connecteurs.md).
 * « Facturation » and « Communautés et abonnements » stay in reserve: none of their tools is shown in V0.
 */
export const INTEGRATION_FAMILIES = [
  {
    id: "courses",
    title: "Formations et tunnels de vente",
    text: "Vos élèves reçoivent une demande d'avis après leur achat ou leur inscription.",
  },
  {
    id: "appointments",
    title: "Rendez-vous et séances",
    text: "Vos clients reçoivent une demande d'avis après la séance, jamais avant.",
  },
  { id: "payments", title: "Paiements en ligne", text: "Une demande d'avis part après chaque paiement réussi." },
  {
    id: "events",
    title: "Événements et webinaires",
    text: "Les participants reçoivent une demande d'avis après l'événement.",
  },
  { id: "shops", title: "Boutiques en ligne", text: "Vos acheteurs reçoivent une demande d'avis après leur commande." },
  {
    id: "other-tools",
    title: "Tous vos autres outils",
    text: "Votre outil n'est pas dans la liste ? Reliez-le avec Zapier, Make ou n8n.",
  },
] as const;

export type IntegrationFamilyId = (typeof INTEGRATION_FAMILIES)[number]["id"];
