import type { UpcomingIntegration } from "./types";

export const WOOCOMMERCE: UpcomingIntegration = {
  status: "soon",
  slug: "woocommerce",
  connector: "woocommerce",
  name: "WooCommerce",
  family: "shops",
  summary: "Une demande d'avis après chaque commande payée.",
  seo: {
    title: "Témoignages automatiques pour WooCommerce, bientôt",
    description:
      "Bientôt, chaque commande payée sur votre boutique WooCommerce déclenchera une demande d'avis à votre nom. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour WooCommerce",
  intro: "Bientôt, chaque commande payée sur votre boutique WooCommerce déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque commande payée déclenche une demande d'avis, au délai choisi pour l'offre.",
    "Vos produits WooCommerce s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
    "Une seule demande par client et par offre, avec une relance au plus.",
  ],
};
