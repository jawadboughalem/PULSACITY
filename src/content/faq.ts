import { FOUNDER_PRICE_SEATS, PLANS } from "@/config/plans";
import { formatPrice } from "@/lib/french/format-price";
import { DEFAULT_REQUEST_DELAY_DAYS, REMINDER_DELAY_DAYS } from "@/lib/requests/request-timing";
import { YEARLY_FREE_MONTHS } from "./plan-offer";

/** A question of the public site: shown in a list that opens one answer at a time, and given to search engines as is. */
export type FaqEntry = {
  question: string;
  answer: string;
};

/** The answers shared by the home page, the prices and the help page (/aide). */
export const RESIGN: FaqEntry = {
  question: "Comment résilier ?",
  answer:
    "Depuis votre espace, en deux clics, sans frais ni préavis. Votre abonnement s'arrête à la fin de la période déjà payée. Votre espace repasse alors au plan Gratuit, avec tous vos témoignages.",
};

export const REQUEST_TIMING: FaqEntry = {
  question: "Quand la demande d'avis est-elle envoyée ?",
  answer: `Vous choisissez le délai pour chaque offre, par exemple 30 jours après l'achat pour un programme d'un mois. Par défaut, ${DEFAULT_REQUEST_DELAY_DAYS} jours. Sans réponse, une seule relance part ${REMINDER_DELAY_DAYS} jours plus tard.`,
};

export const GDPR: FaqEntry = {
  question: "Est-ce conforme au RGPD ?",
  answer:
    "Oui. Pour les données de vos clients, PULSACITY agit comme sous-traitant : nous les traitons pour votre compte, seulement pour demander et afficher leurs avis. Chaque témoignage est publié avec l'accord explicite de son auteur, daté et gardé comme preuve. Les données sont stockées dans l'Union européenne.",
};

export const SITE_COMPATIBILITY: FaqEntry = {
  question: "Est-ce compatible avec mon site ?",
  answer:
    "Le widget s'affiche sur toute page qui accepte un bloc de code HTML : Systeme.io, WordPress et la plupart des outils de création de pages. Il reprend la police et la couleur de votre page, sans rien changer autour. Pour les ventes, Systeme.io se connecte directement, et vos autres outils passent par le connecteur universel, avec Zapier, Make ou n8n.",
};

export const VAT: FaqEntry = {
  question: "Les prix incluent-ils la TVA ?",
  answer:
    "Le prix affiché est celui que vous payez. PULSACITY ne facture pas de TVA aujourd'hui : il n'y en a donc aucune à récupérer sur nos factures.",
};

/** The answers of positionnement.md (section 11) shared by the home page and /aide. */
export const NOT_TECHNICAL: FaqEntry = {
  question: "Je ne suis pas technique. C'est pour moi ?",
  answer:
    "Oui. Vous collez une adresse dans votre outil de vente, puis un code sur votre page. Chaque étape a son guide, pas à pas.",
};

export const FIRST_TESTIMONIAL_DELAY: FaqEntry = {
  question: "Combien de temps avant le premier témoignage ?",
  answer: `Le délai choisi pour l'offre : ${DEFAULT_REQUEST_DELAY_DAYS} jours par défaut. Vous pouvez aussi demander un avis tout de suite à un client que vous saisissez à la main.`,
};

export const TOOL_NOT_LISTED: FaqEntry = {
  question: "Mon outil n'est pas dans la liste.",
  answer:
    "Reliez-le avec Zapier, Make ou n8n, grâce au connecteur universel. Make propose un plan gratuit. Et dites-nous lequel, sur la page des intégrations : un outil demandé trois fois passe en « Bientôt ».",
};

export const CUSTOMERS_DISTURBED: FaqEntry = {
  question: "Mes clients vont-ils être dérangés ?",
  answer:
    "Non. Deux e-⁠mails au plus par client et par offre : la demande et une relance. Chacun contient un lien de désinscription. Les réponses arrivent chez vous.",
};

export const WIDGET_SAFE: FaqEntry = {
  question: "Le widget peut-il abîmer ma page ?",
  answer:
    "Non. Il s'affiche dans son propre cadre, sans toucher au reste de votre page, et ne la fait pas sauter pendant le chargement. Pour le retirer, vous supprimez le code.",
};

/** positionnement.md, section 11: whether the customers answer, against a form of one's own. */
export const NO_ANSWER: FaqEntry = {
  question: "Et si mes clients ne répondent pas ?",
  answer:
    "Personne ne peut promettre que tous répondront. PULSACITY met les chances de votre côté : la demande arrive à votre nom, au moment que vous choisissez, et se remplit depuis un téléphone. Une relance part si besoin, jamais plus.",
};

export const HAVE_A_FORM: FaqEntry = {
  question: "J'ai déjà un formulaire. Pourquoi changer ?",
  answer:
    "Un formulaire attend qu'on pense à l'envoyer. PULSACITY l'envoie pour vous après chaque vente, relance une fois, garde l'accord de votre client et affiche son avis sur votre page. Vos anciens témoignages ? Ajoutez-les à la main ou importez-les d'un fichier.",
};

/** The rule of the badge's rating is built since lot 4.13: every review received, but those hidden for a reason. */
export const NEGATIVE_REVIEW: FaqEntry = {
  question: "Que se passe-t-il si je reçois un avis négatif ?",
  answer:
    "Vous recevez chaque avis avant qu'il s'affiche. Un avis critique mais honnête rend les autres plus crédibles : les acheteurs se méfient des notes trop parfaites. La note du badge compte tous les avis reçus, sauf ceux que vous masquez pour un motif.",
};

export const PERSONAL_DATA: FaqEntry = {
  question: "Et les données personnelles ?",
  answer:
    "Votre client donne son accord avant toute publication, et cet accord est daté et gardé. Les données sont hébergées dans l'Union européenne. PULSACITY les traite pour vous : vous pouvez tout exporter ou tout supprimer.",
};

/** « Vos questions » of the home page (positionnement.md, section 11; maquettes 3.5), in their order. */
export const HOME_FAQ: FaqEntry[] = [
  NO_ANSWER,
  HAVE_A_FORM,
  NOT_TECHNICAL,
  WIDGET_SAFE,
  NEGATIVE_REVIEW,
  CUSTOMERS_DISTURBED,
  PERSONAL_DATA,
  FIRST_TESTIMONIAL_DELAY,
  TOOL_NOT_LISTED,
];

/**
 * « Facturation » of Tarifs (maquettes 3.5), with the rules of decisions/tarifs.md: the launch price, the changes of
 * plan, the end of a subscription, the requests past the free plan's month (arbitrages.md, n° 4).
 */
export const BILLING_FAQ: FaqEntry[] = [
  VAT,
  {
    question: "Le prix de lancement est-il gardé longtemps ?",
    answer: `Oui, à vie, tant que votre abonnement ne s'interrompt pas, et quel que soit votre plan. Il est réservé aux ${FOUNDER_PRICE_SEATS} premiers abonnés : ensuite, ${PLANS.essentiel.name} passe à ${formatPrice(PLANS.essentiel.priceCents.monthly, "EUR")} par mois pour les nouveaux.`,
  },
  RESIGN,
  {
    question: "Que deviennent mes témoignages si j'arrête ?",
    answer: `Rien n'est supprimé : vos témoignages restent dans votre espace. À la fin de la période payée, au plan Gratuit, ${PLANS.free.limits.widgets} widget reste sur votre page, le plus ancien ou celui que vous choisissez, avec ${PLANS.free.limits.testimonials} témoignages validés : ceux mis en avant, puis les plus récents. Les nouveaux attendent dans votre espace, et vos autres widgets reviennent avec ${PLANS.essentiel.name}.`,
  },
  {
    question: "Puis-je changer de plan en cours de route ?",
    answer:
      "Oui, depuis votre espace. Un plan supérieur s'applique tout de suite : vous payez la différence au prorata. Un plan inférieur s'applique à la fin de la période déjà payée, sans remboursement.",
  },
  {
    question: "Puis-je passer du mensuel à l'annuel ?",
    answer: `Oui, et dans l'autre sens aussi, depuis votre espace. Le changement prend effet à la fin de la période déjà payée, sans remboursement. L'année coûte ${12 - YEARLY_FREE_MONTHS} mois : ${YEARLY_FREE_MONTHS} mois sont offerts.`,
  },
  {
    question: `Et si je dépasse ${PLANS.free.limits.monthlyRequests} demandes dans le mois, au plan Gratuit ?`,
    answer: `Les suivantes sont gardées : elles partent le 1er du mois suivant. Rien n'est perdu, et le plan ${PLANS.essentiel.name} lève cette limite.`,
  },
];
