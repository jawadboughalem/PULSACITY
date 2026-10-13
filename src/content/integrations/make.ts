import type { UpcomingIntegration } from "./types";

export const MAKE: UpcomingIntegration = {
  status: "soon",
  slug: "make",
  connector: "make",
  name: "Make",
  family: "other-tools",
  meanwhileVia: "universal",
  guideSlug: "envoyer-vos-ventes-avec-make",
  summary: "Reliez des milliers d'outils, même avec le plan gratuit de Make.",
  seo: {
    title: "Témoignages automatiques pour Make, bientôt",
    description:
      "Bientôt, une app PULSACITY pour Make : vos ventes déclencheront une demande d'avis à votre nom, sans réglage technique. Aujourd'hui, suivez le guide.",
  },
  heading: "Témoignages automatiques pour Make",
  intro: "Bientôt, une app PULSACITY pour Make enverra vos ventes sans réglage technique : chacune déclenchera une demande d'avis à votre nom. Le guide fait déjà la même chose aujourd'hui.",
  willDo: [
    "L'app PULSACITY, partagée par lien : votre adresse collée une fois, puis les champs de la vente proposés un par un.",
    "Elle fonctionne avec le plan gratuit de Make.",
    "Chaque vente que vous choisissez part au connecteur universel de votre espace.",
  ],
};
