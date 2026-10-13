import type { UpcomingIntegration } from "./types";

export const PODIA: UpcomingIntegration = {
  status: "soon",
  slug: "podia",
  connector: "podia",
  name: "Podia",
  family: "courses",
  meanwhileVia: "zapier",
  guideSlug: "envoyer-vos-ventes-podia-avec-zapier",
  summary: "Une demande d'avis après chaque vente, avec Zapier.",
  seo: {
    title: "Témoignages automatiques pour Podia, bientôt",
    description:
      "Bientôt, l'app PULSACITY de Zapier pour vos ventes Podia : une demande d'avis à votre nom, sans réglage technique. Aujourd'hui, suivez le guide.",
  },
  heading: "Témoignages automatiques pour Podia",
  intro: "Bientôt, avec l'app PULSACITY de Zapier, chaque vente Podia déclenchera une demande d'avis à votre nom, sans réglage technique. Le guide fait déjà la même chose aujourd'hui.",
  willDo: [
    "Chaque vente Podia déclenche une demande d'avis, au délai choisi pour l'offre.",
    "L'app PULSACITY de Zapier remplace l'étape Webhooks by Zapier du guide.",
    "Vos produits Podia s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
