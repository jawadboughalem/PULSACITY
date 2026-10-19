/**
 * The families of the catalog, in their order of display, with their sentence (docs-internes/decisions/connecteurs.md).
 * « Facturation » and « Communautés et abonnements » stay in reserve: none of their tools is shown in V0. Each has
 * its filter chip (maquettes 3.3 and 3.4) and the word that names it in the address.
 */
export const INTEGRATION_FAMILIES = [
  {
    id: "courses",
    filterLabel: "Formations",
    searchValue: "formations",
    title: "Formations et tunnels de vente",
    text: "Vos élèves reçoivent une demande d'avis après leur achat ou leur inscription.",
  },
  {
    id: "appointments",
    filterLabel: "Rendez-vous",
    searchValue: "rendez-vous",
    title: "Rendez-vous et séances",
    text: "Vos clients reçoivent une demande d'avis après la séance, jamais avant.",
  },
  {
    id: "payments",
    filterLabel: "Paiements",
    searchValue: "paiements",
    title: "Paiements en ligne",
    text: "Une demande d'avis part après chaque paiement réussi.",
  },
  {
    id: "events",
    filterLabel: "Événements",
    searchValue: "evenements",
    title: "Événements et webinaires",
    text: "Les participants reçoivent une demande d'avis après l'événement.",
  },
  {
    id: "shops",
    filterLabel: "Boutiques",
    searchValue: "boutiques",
    title: "Boutiques en ligne",
    text: "Vos acheteurs reçoivent une demande d'avis après leur commande.",
  },
  {
    id: "other-tools",
    filterLabel: "Autres outils",
    searchValue: "autres-outils",
    title: "Tous vos autres outils",
    text: "Votre outil n'est pas dans la liste ? Reliez-le avec Zapier, Make ou n8n.",
  },
] as const;

export type IntegrationFamilyId = (typeof INTEGRATION_FAMILIES)[number]["id"];
