import type { UpcomingIntegration } from "./types";

export const STRIPE: UpcomingIntegration = {
  status: "soon",
  slug: "stripe",
  connector: "stripe",
  name: "Stripe",
  summary: "Paiements en ligne. Une demande d'avis après chaque paiement réussi.",
  seo: {
    title: "Témoignages automatiques pour Stripe, bientôt",
    description:
      "Bientôt, chaque paiement Stripe réussi déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Stripe",
  intro: "Bientôt, chaque paiement réussi sur Stripe déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque paiement réussi déclenche une demande d'avis, au délai choisi pour l'offre.",
    "Un paiement remboursé annule la demande prévue.",
    "Vos produits Stripe s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
