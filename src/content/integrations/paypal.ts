import type { UpcomingIntegration } from "./types";

export const PAYPAL: UpcomingIntegration = {
  status: "soon",
  slug: "paypal",
  connector: "paypal",
  name: "PayPal",
  family: "payments",
  summary: "Une demande d'avis après chaque paiement reçu.",
  seo: {
    title: "Témoignages automatiques pour PayPal, bientôt",
    description:
      "Bientôt, chaque paiement reçu sur PayPal déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour PayPal",
  intro: "Bientôt, chaque paiement reçu sur PayPal déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque paiement reçu déclenche une demande d'avis, au délai choisi pour l'offre.",
    "Vos produits PayPal s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
    "Une seule demande par client et par offre, avec une relance au plus.",
  ],
};
