import type { UpcomingIntegration } from "./types";

export const KAJABI: UpcomingIntegration = {
  status: "soon",
  slug: "kajabi",
  connector: "kajabi",
  name: "Kajabi",
  family: "courses",
  summary: "Une demande d'avis après chaque achat d'une offre.",
  seo: {
    title: "Témoignages automatiques pour Kajabi, bientôt",
    description:
      "Bientôt, chaque achat d'une offre Kajabi déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Kajabi",
  intro: "Bientôt, chaque achat d'une offre Kajabi déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Chaque achat d'une offre déclenche une demande d'avis, au délai choisi pour l'offre.",
    "Une seule adresse pour tout votre site Kajabi, ou une par offre.",
    "Vos offres Kajabi s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
