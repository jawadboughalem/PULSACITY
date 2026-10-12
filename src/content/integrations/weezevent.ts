import type { UpcomingIntegration } from "./types";

export const WEEZEVENT: UpcomingIntegration = {
  status: "soon",
  slug: "weezevent",
  connector: "weezevent",
  name: "Weezevent",
  family: "events",
  summary: "Une demande d'avis après l'événement, à chaque participant.",
  seo: {
    title: "Témoignages automatiques pour Weezevent, bientôt",
    description:
      "Bientôt, chaque participant à vos événements Weezevent recevra une demande d'avis à votre nom, après l'événement. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour Weezevent",
  intro: "Bientôt, chaque participant à vos événements Weezevent recevra une demande d'avis à votre nom, après l'événement.",
  willDo: [
    "Chaque billet prépare une demande d'avis, qui part après la date de l'événement.",
    "Vos événements Weezevent s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
    "Une seule demande par participant et par offre, avec une relance au plus.",
  ],
};
