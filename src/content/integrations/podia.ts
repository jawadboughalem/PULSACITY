import type { UpcomingIntegration } from "./types";

export const PODIA: UpcomingIntegration = {
  status: "soon",
  slug: "podia",
  connector: "podia",
  name: "Podia",
  family: "courses",
  meanwhileVia: "zapier",
  summary: "Une demande d'avis après chaque vente, avec Zapier.",
  seo: {
    title: "Témoignages automatiques pour Podia, bientôt",
    description:
      "Bientôt, chaque vente Podia déclenchera une demande d'avis à votre nom, grâce à Zapier. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Podia",
  intro: "Bientôt, chaque vente Podia déclenchera une demande d'avis à votre nom, grâce à Zapier.",
  willDo: [
    "Un Zap envoie chaque nouvelle vente Podia à PULSACITY : une demande d'avis part au délai choisi pour l'offre.",
    "Il demande un plan payant de Zapier. Un guide montre chaque écran.",
    "Vos produits Podia s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
