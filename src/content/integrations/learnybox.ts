import type { UpcomingIntegration } from "./types";

export const LEARNYBOX: UpcomingIntegration = {
  status: "soon",
  slug: "learnybox",
  connector: "learnybox",
  name: "Learnybox",
  family: "courses",
  summary: "Une demande d'avis après chaque vente ou inscription.",
  seo: {
    title: "Témoignages automatiques pour Learnybox, bientôt",
    description:
      "Bientôt, chaque vente ou inscription sur Learnybox déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Learnybox",
  intro: "Bientôt, chaque vente ou inscription sur Learnybox déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque vente ou inscription à une formation déclenche une demande d'avis, au délai choisi pour l'offre.",
    "Une adresse et la clé de votre compte Learnybox, à coller une fois : rien à installer.",
    "Vos produits Learnybox s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
