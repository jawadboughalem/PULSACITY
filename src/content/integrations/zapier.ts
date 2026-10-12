import type { UpcomingIntegration } from "./types";

export const ZAPIER: UpcomingIntegration = {
  status: "soon",
  slug: "zapier",
  connector: "zapier",
  name: "Zapier",
  family: "other-tools",
  summary: "Reliez des milliers d'outils : une demande d'avis après chaque vente que vous choisissez.",
  seo: {
    title: "Témoignages automatiques pour Zapier, bientôt",
    description:
      "Bientôt, un Zap enverra à PULSACITY les ventes de vos autres outils : chacune déclenchera une demande d'avis à votre nom. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour Zapier",
  intro: "Bientôt, un Zap enverra à PULSACITY les ventes de vos autres outils : chacune déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Un Zap envoie chaque vente que vous choisissez au connecteur universel de votre espace.",
    "Il passe par Webhooks by Zapier, réservé aux plans payants de Zapier.",
    "Un guide montre chaque écran de Zapier.",
  ],
};
