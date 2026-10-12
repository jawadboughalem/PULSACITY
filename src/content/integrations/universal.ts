import type { UpcomingIntegration } from "./types";

export const UNIVERSAL: UpcomingIntegration = {
  status: "soon",
  slug: "connecteur-universel",
  connector: "universal",
  name: "Connecteur universel",
  family: "other-tools",
  summary: "Envoyez vos ventes depuis n'importe quel outil : une demande d'avis part pour chacune.",
  seo: {
    title: "Témoignages automatiques depuis n'importe quel outil, bientôt",
    description:
      "Bientôt, envoyez vos ventes depuis n'importe quel outil, avec Zapier, Make ou n8n : chacune déclenchera une demande d'avis. Soyez prévenu de sa sortie.",
  },
  heading: "Témoignages automatiques depuis n'importe quel outil",
  intro: "Bientôt, une adresse propre à votre espace recevra vos ventes depuis n'importe quel outil, avec Zapier, Make ou n8n : chacune déclenchera une demande d'avis à votre nom.",
  willDo: [
    "Une adresse propre à votre espace reçoit chaque vente : l'adresse e-⁠mail du client suffit.",
    "Une vente reçue deux fois ne déclenche qu'une demande.",
    "Une offre encore inconnue vous attend dans « Offres à associer », comme avec Systeme.io.",
  ],
};
