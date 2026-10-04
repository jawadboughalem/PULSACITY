import { MEANWHILE } from "./meanwhile";
import type { UpcomingIntegration } from "./types";

export const STRIPE: UpcomingIntegration = {
  status: "soon",
  slug: "stripe",
  connector: "stripe",
  name: "Stripe",
  summary: "Paiements en ligne : une demande d'avis après chaque paiement réussi.",
  seo: {
    title: "Témoignages automatiques pour Stripe, bientôt",
    description:
      "Bientôt, chaque paiement Stripe réussi déclenchera une demande d'avis à votre nom. Laissez votre adresse pour être prévenu le jour de sa sortie.",
  },
  heading: "Témoignages automatiques pour Stripe",
  intro:
    "Vous encaissez avec Stripe : liens de paiement, Checkout ou abonnements. Bientôt, chaque paiement réussi déclenchera une demande d'avis à votre nom, au moment choisi.",
  willDo: [
    "Une demande d'avis après chaque paiement réussi, au délai choisi pour l'offre.",
    "Une seule relance sans réponse, et la désinscription en un clic.",
    "Les avis validés sur votre page de vente, avec le même widget.",
  ],
  meanwhile: MEANWHILE,
};
