import { PLANS } from "@/config/plans";

/** What works with any tool, while its connector is to come (/integrations/stripe, /integrations/calendly). */
export const MEANWHILE = [
  {
    title: "Demander un avis",
    text: `Saisissez le prénom, l'adresse et l'offre d'un client : la même demande part, avec sa relance. Jusqu'à ${PLANS.free.limits.manualRequestsPerDay} par jour.`,
  },
  {
    title: "Votre lien de collecte",
    text: "Une page à votre nom où vos clients laissent leur avis en moins d'une minute. À glisser dans vos e-mails, vos messages ou votre espace membre.",
  },
  {
    title: "Le widget sur votre page de vente",
    text: "Mur, carrousel ou badge : collé une fois, il affiche chaque avis validé, sur n'importe quelle page qui accepte un bloc de code HTML.",
  },
];
