import type { UpcomingIntegration } from "./types";

export const CAL_COM: UpcomingIntegration = {
  status: "soon",
  slug: "cal-com",
  connector: "calcom",
  name: "Cal.com",
  family: "appointments",
  summary: "Une demande d'avis après chaque séance terminée.",
  seo: {
    title: "Témoignages automatiques pour Cal.com, bientôt",
    description:
      "Bientôt, chaque séance terminée sur Cal.com déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Cal.com",
  intro: "Bientôt, chaque séance terminée sur Cal.com déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque séance terminée déclenche une demande d'avis, au délai choisi, jamais avant.",
    "Une adresse à coller une fois dans les réglages de Cal.com.",
    "Vos types d'événements Cal.com s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
