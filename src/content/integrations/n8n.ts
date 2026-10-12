import type { UpcomingIntegration } from "./types";

export const N8N: UpcomingIntegration = {
  status: "soon",
  slug: "n8n",
  connector: "n8n",
  name: "n8n",
  family: "other-tools",
  meanwhileVia: "universal",
  guideSlug: "envoyer-vos-ventes-avec-n8n",
  summary: "Reliez n'importe quel outil avec n8n : une demande d'avis après chaque vente.",
  seo: {
    title: "Témoignages automatiques pour n8n, bientôt",
    description:
      "Bientôt, un workflow n8n enverra à PULSACITY les ventes de vos autres outils : chacune déclenchera une demande d'avis à votre nom. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour n8n",
  intro: "Bientôt, un workflow n8n enverra à PULSACITY les ventes de vos autres outils : chacune déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Un workflow n8n envoie chaque vente que vous choisissez au connecteur universel de votre espace.",
    "Un seul nœud suffit, HTTP Request, vers votre adresse PULSACITY.",
    "Un guide montre chaque réglage.",
  ],
};
