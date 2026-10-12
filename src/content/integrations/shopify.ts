import type { UpcomingIntegration } from "./types";

export const SHOPIFY: UpcomingIntegration = {
  status: "soon",
  slug: "shopify",
  connector: "shopify",
  name: "Shopify",
  family: "shops",
  summary: "Une demande d'avis après chaque commande payée.",
  seo: {
    title: "Témoignages automatiques pour Shopify, bientôt",
    description:
      "Bientôt, chaque commande payée sur votre boutique Shopify déclenchera une demande d'avis à votre nom. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour Shopify",
  intro: "Bientôt, chaque commande payée sur votre boutique Shopify déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque commande payée déclenche une demande d'avis, au délai choisi pour l'offre.",
    "Vos produits Shopify s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
    "Une seule demande par client et par offre, avec une relance au plus.",
  ],
};
