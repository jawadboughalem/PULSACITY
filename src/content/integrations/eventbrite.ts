import type { UpcomingIntegration } from "./types";

export const EVENTBRITE: UpcomingIntegration = {
  status: "soon",
  slug: "eventbrite",
  connector: "eventbrite",
  name: "Eventbrite",
  family: "events",
  summary: "Une demande d'avis après l'événement, à chaque participant.",
  seo: {
    title: "Témoignages automatiques pour Eventbrite, bientôt",
    description:
      "Bientôt, chaque participant à vos événements Eventbrite recevra une demande d'avis à votre nom, après l'événement. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour Eventbrite",
  intro: "Bientôt, chaque participant à vos événements Eventbrite recevra une demande d'avis à votre nom, après l'événement.",
  willDo: [
    "Chaque billet prépare une demande d'avis, qui part après la date de l'événement.",
    "Vos événements Eventbrite s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
    "Une seule demande par participant et par offre, avec une relance au plus.",
  ],
};
