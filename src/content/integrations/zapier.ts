import type { UpcomingIntegration } from "./types";

export const ZAPIER: UpcomingIntegration = {
  status: "soon",
  slug: "zapier",
  connector: "zapier",
  name: "Zapier",
  family: "other-tools",
  meanwhileVia: "universal",
  guideSlug: "envoyer-vos-ventes-avec-zapier",
  summary: "Reliez des milliers d'outils : une demande d'avis après chaque vente que vous choisissez.",
  seo: {
    title: "Témoignages automatiques pour Zapier, bientôt",
    description:
      "Bientôt, l'app PULSACITY dans Zapier : vos ventes déclencheront une demande d'avis à votre nom, sans réglage technique. Aujourd'hui, suivez le guide.",
  },
  heading: "Témoignages automatiques pour Zapier",
  intro: "Bientôt, PULSACITY aura son app dans Zapier : chaque vente que vous choisissez déclenchera une demande d'avis à votre nom. Le guide fait déjà la même chose aujourd'hui.",
  willDo: [
    "L'app PULSACITY dans la liste des apps de Zapier : une étape à ajouter à votre Zap.",
    "Elle remplace l'étape Webhooks by Zapier du guide.",
    "Chaque vente que vous choisissez part au connecteur universel de votre espace.",
  ],
};
