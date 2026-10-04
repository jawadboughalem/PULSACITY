import { MEANWHILE } from "./meanwhile";
import type { UpcomingIntegration } from "./types";

export const CALENDLY: UpcomingIntegration = {
  status: "soon",
  slug: "calendly",
  connector: "calendly",
  name: "Calendly",
  summary: "Rendez-vous : une demande d'avis après chaque séance réalisée.",
  seo: {
    title: "Témoignages automatiques pour Calendly, bientôt",
    description:
      "Bientôt, chaque séance réservée sur Calendly déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Calendly",
  intro:
    "Vos clients réservent leurs séances avec Calendly : coaching, conseil, accompagnement. Bientôt, chaque séance réalisée déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Une demande d'avis après chaque séance, au délai choisi.",
    "Une seule relance sans réponse, et la désinscription en un clic.",
    "Les avis validés sur votre page de vente, avec le même widget.",
  ],
  meanwhile: MEANWHILE,
};
