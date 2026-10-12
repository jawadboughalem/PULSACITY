import type { UpcomingIntegration } from "./types";

export const HELLOASSO: UpcomingIntegration = {
  status: "soon",
  slug: "helloasso",
  connector: "helloasso",
  name: "HelloAsso",
  family: "events",
  summary: "Une demande d'avis après chaque adhésion, billet ou paiement à votre association.",
  seo: {
    title: "Témoignages automatiques pour HelloAsso, bientôt",
    description:
      "Bientôt, chaque adhésion, billet ou paiement reçu sur HelloAsso déclenchera une demande d'avis au nom de votre association. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour HelloAsso",
  intro: "Bientôt, chaque adhésion, billet ou paiement reçu sur HelloAsso déclenchera une demande d'avis au nom de votre association.",
  willDo: [
    "Chaque adhésion, billet ou paiement déclenche une demande d'avis, au délai choisi.",
    "Vos formulaires HelloAsso s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
    "Une seule demande par personne et par offre, avec une relance au plus.",
  ],
};
