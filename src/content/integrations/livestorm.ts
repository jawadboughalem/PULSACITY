import type { UpcomingIntegration } from "./types";

export const LIVESTORM: UpcomingIntegration = {
  status: "soon",
  slug: "livestorm",
  connector: "livestorm",
  name: "Livestorm",
  family: "events",
  summary: "Une demande d'avis aux participants présents, après le webinaire.",
  seo: {
    title: "Témoignages automatiques pour Livestorm, bientôt",
    description:
      "Bientôt, les participants présents à vos webinaires Livestorm recevront une demande d'avis à votre nom. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques pour Livestorm",
  intro: "Bientôt, les participants présents à vos webinaires Livestorm recevront une demande d'avis à votre nom.",
  willDo: [
    "Les participants présents reçoivent une demande d'avis après le webinaire, au délai choisi.",
    "Les inscrits absents ne reçoivent rien.",
    "Vos webinaires Livestorm s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
