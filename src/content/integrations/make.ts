import type { UpcomingIntegration } from "./types";

export const MAKE: UpcomingIntegration = {
  status: "soon",
  slug: "make",
  connector: "make",
  name: "Make",
  family: "other-tools",
  meanwhileVia: "universal",
  summary: "Reliez des milliers d'outils, même avec le plan gratuit de Make.",
  seo: {
    title: "Témoignages automatiques pour Make, bientôt",
    description:
      "Bientôt, un scénario Make enverra à PULSACITY les ventes de vos autres outils : chacune déclenchera une demande d'avis à votre nom. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour Make",
  intro: "Bientôt, un scénario Make enverra à PULSACITY les ventes de vos autres outils : chacune déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Un scénario Make envoie chaque vente que vous choisissez au connecteur universel de votre espace.",
    "Il fonctionne avec le plan gratuit de Make.",
    "Une app PULSACITY pour Make, partagée par lien, vous évite les réglages techniques.",
  ],
};
