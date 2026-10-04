import type { UpcomingIntegration } from "./types";

export const CALENDLY: UpcomingIntegration = {
  status: "soon",
  slug: "calendly",
  connector: "calendly",
  name: "Calendly",
  summary: "Rendez-vous. Une demande d'avis après chaque séance réalisée.",
  seo: {
    title: "Témoignages automatiques pour Calendly, bientôt",
    description:
      "Bientôt, chaque rendez-vous terminé sur Calendly déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Calendly",
  intro: "Bientôt, chaque rendez-vous terminé sur Calendly déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque rendez-vous terminé déclenche une demande d'avis, au délai choisi.",
    "Un rendez-vous annulé ne déclenche rien.",
    "Vos types de rendez-vous s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
