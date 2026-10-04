import { PLANS } from "@/config/plans";
import { formatPrice } from "@/lib/french/format-price";
import { DEFAULT_REQUEST_DELAY_DAYS, REMINDER_DELAY_DAYS } from "@/lib/requests/request-timing";
import { YEARLY_FREE_MONTHS } from "./plan-offer";

/** A question of the public site: shown in a list that opens one answer at a time, and given to search engines as is. */
export type FaqEntry = {
  question: string;
  answer: string;
};

const ESSENTIEL_MONTHLY = PLANS.essentiel.priceCents.monthly;

/** The French rate, to show what a company that recovers VAT pays in the end (decision_tarifs.md). */
const FRENCH_VAT_RATE = 0.2;

const RESIGN: FaqEntry = {
  question: "Comment résilier ?",
  answer:
    "Depuis votre espace, en deux clics, sans frais ni préavis. Votre abonnement s'arrête à la fin de la période déjà payée. Votre espace repasse alors au plan Gratuit, avec tous vos témoignages.",
};

/** « Vos questions », maquette 7: the delay, the GDPR, unsubscribing, compatibility, cancelling. */
export const HOME_FAQ: FaqEntry[] = [
  {
    question: "Quand la demande d'avis est-elle envoyée ?",
    answer: `Vous choisissez le délai pour chaque offre, par exemple 30 jours après l'achat pour un programme d'un mois. Par défaut, ${DEFAULT_REQUEST_DELAY_DAYS} jours. Sans réponse, une seule relance part ${REMINDER_DELAY_DAYS} jours plus tard.`,
  },
  {
    question: "Est-ce conforme au RGPD ?",
    answer:
      "Oui. Pour les données de vos clients, PULSACITY agit comme sous-traitant : nous les traitons pour votre compte, seulement pour demander et afficher leurs avis. Chaque témoignage est publié avec l'accord explicite de son auteur, daté et gardé comme preuve. Les données sont stockées dans l'Union européenne.",
  },
  {
    question: "Mes clients peuvent-ils se désinscrire ?",
    answer:
      "Oui, en un clic. Chaque e-mail contient un lien de désinscription, et la plupart des messageries affichent aussi un bouton. Un client reçoit au plus deux e-mails par offre : la demande et une relance.",
  },
  {
    question: "Est-ce compatible avec mon site ?",
    answer:
      "Le widget s'affiche sur toute page qui accepte un bloc de code HTML : Systeme.io, WordPress et la plupart des outils de création de pages. Il reprend la police et la couleur de votre page, sans rien changer autour. Pour les ventes, la connexion automatique marche aujourd'hui avec Systeme.io. Stripe et Calendly arrivent.",
  },
  RESIGN,
];

/** « Facturation », maquette 8. */
export const BILLING_FAQ: FaqEntry[] = [
  {
    question: "Les prix incluent-ils la TVA ?",
    answer: `Oui. Le prix affiché est celui que vous payez, TVA comprise. Si votre entreprise récupère la TVA, la facture la détaille : Essentiel vous revient à ${formatPrice(Math.round(ESSENTIEL_MONTHLY / (1 + FRENCH_VAT_RATE)), "EUR")} HT par mois. Avec un numéro de TVA d'un autre pays de l'Union européenne, la TVA est autoliquidée : vous payez ${formatPrice(ESSENTIEL_MONTHLY, "EUR")}, sans TVA.`,
  },
  RESIGN,
  {
    question: "Que deviennent mes témoignages si j'arrête ?",
    answer: `Rien n'est supprimé. Vos témoignages restent dans votre espace et sur vos pages. Au plan Gratuit, au-delà de ${PLANS.free.limits.testimonials} témoignages validés, les nouveaux attendent dans votre espace jusqu'à ce que vous repreniez un plan.`,
  },
  {
    question: "Puis-je passer du mensuel à l'annuel ?",
    answer: `Oui, à tout moment depuis votre espace. L'année coûte ${12 - YEARLY_FREE_MONTHS} mois : ${YEARLY_FREE_MONTHS} mois sont offerts. Ce que vous avez déjà payé pour le mois en cours est déduit.`,
  },
];
