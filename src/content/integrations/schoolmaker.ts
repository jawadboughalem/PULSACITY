import type { UpcomingIntegration } from "./types";

export const SCHOOLMAKER: UpcomingIntegration = {
  status: "soon",
  slug: "schoolmaker",
  connector: "schoolmaker",
  name: "SchoolMaker",
  family: "courses",
  summary: "Une demande d'avis quand un membre rejoint une offre.",
  seo: {
    title: "Témoignages automatiques pour SchoolMaker, bientôt",
    description:
      "Bientôt, chaque membre qui rejoint une offre SchoolMaker recevra une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour SchoolMaker",
  intro: "Bientôt, chaque membre qui rejoint une offre SchoolMaker recevra une demande d'avis à votre nom.",
  willDo: [
    "Chaque membre qui rejoint une offre reçoit une demande d'avis, au délai choisi pour l'offre.",
    "Directement avec les plans Pro et Business de SchoolMaker ; avec les autres, par Zapier ou Make.",
    "Vos offres SchoolMaker s'associent à vos offres PULSACITY, comme les produits Systeme.io.",
  ],
};
