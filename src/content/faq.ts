import { PLANS } from "@/config/plans";
import { DEFAULT_REQUEST_DELAY_DAYS, REMINDER_DELAY_DAYS } from "@/lib/requests/request-timing";
import { YEARLY_FREE_MONTHS } from "./plan-offer";

/** A question of the public site: shown in a list that opens one answer at a time, and given to search engines as is. */
export type FaqEntry = {
  question: string;
  answer: string;
};

const RESIGN: FaqEntry = {
  question: "Comment résilier ?",
  answer:
    "Depuis votre espace, en deux clics, sans frais ni préavis. Votre abonnement s'arrête à la fin de la période déjà payée. Votre espace repasse alors au plan Gratuit, avec tous vos témoignages.",
};

/** « Vos questions », maquette 7: the delay, the GDPR, unsubscribing, compatibility, cancelling. */
export const HOME_FAQ: FaqEntry[] = [
  {
    question: "Quand la demande d'avis est-elle envoyée ?",
    answer: `Vous choisissez le délai pour chaque offre, par exemple 30 jours après l'achat pour un programme d'un mois. Par défaut, ${DEFAULT_REQUEST_DELAY_DAYS} jours. Sans réponse, une seule relance part ${REMINDER_DELAY_DAYS} jours plus tard.`,
  },
  {
    question: "Est-ce conforme au RGPD ?",
    answer:
      "Oui. Pour les données de vos clients, PULSACITY agit comme sous-traitant : nous les traitons pour votre compte, seulement pour demander et afficher leurs avis. Chaque témoignage est publié avec l'accord explicite de son auteur, daté et gardé comme preuve. Les données sont stockées dans l'Union européenne.",
  },
  {
    question: "Mes clients peuvent-ils se désinscrire ?",
    answer:
      "Oui, en un clic. Chaque e-⁠mail contient un lien de désinscription, et la plupart des messageries affichent aussi un bouton. Un client reçoit au plus deux e-⁠mails par offre : la demande et une relance.",
  },
  {
    question: "Est-ce compatible avec mon site ?",
    answer:
      "Le widget s'affiche sur toute page qui accepte un bloc de code HTML : Systeme.io, WordPress et la plupart des outils de création de pages. Il reprend la police et la couleur de votre page, sans rien changer autour. Pour les ventes, Systeme.io se connecte directement, et vos autres outils passent par le connecteur universel, avec Zapier, Make ou n8n.",
  },
  RESIGN,
];

/** « Facturation », maquette 8, with the answers of decisions/tarifs.md. */
export const BILLING_FAQ: FaqEntry[] = [
  {
    question: "Les prix incluent-ils la TVA ?",
    answer:
      "Le prix affiché est celui que vous payez. PULSACITY ne facture pas de TVA aujourd'hui : il n'y en a donc aucune à récupérer sur nos factures.",
  },
  RESIGN,
  {
    question: "Que deviennent mes témoignages si j'arrête ?",
    answer: `Rien n'est supprimé : vos témoignages restent dans votre espace. Au plan Gratuit, ${PLANS.free.limits.widgets} widget reste sur votre page, avec ${PLANS.free.limits.testimonials} témoignages validés, ceux mis en avant d'abord. Les nouveaux attendent dans votre espace, et vos autres widgets reviennent avec ${PLANS.essentiel.name}.`,
  },
  {
    question: "Puis-je passer du mensuel à l'annuel ?",
    answer: `Oui, depuis votre espace. Le changement prend effet à la fin du mois déjà payé. L'année coûte ${12 - YEARLY_FREE_MONTHS} mois : ${YEARLY_FREE_MONTHS} mois sont offerts.`,
  },
];
