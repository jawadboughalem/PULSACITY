import { PLANS } from "@/config/plans";
import { DEFAULT_REQUEST_DELAY_DAYS } from "@/lib/requests/request-timing";
import { type FaqEntry, GDPR, REQUEST_TIMING, RESIGN, SITE_COMPATIBILITY, VAT } from "./faq";

/** A theme of /aide: its questions, then the guide that goes further (maquette 8.4). */
export type HelpTheme = {
  /** The anchor of the theme: /aide#connecteurs. */
  id: string;
  title: string;
  entries: FaqEntry[];
  guideSlug?: string;
};

const { free, essentiel } = PLANS;

/**
 * The questions of /aide, by theme, in the order of 8.4. The answers of the home page and of the prices are the same
 * words; the others come from decisions/positionnement.md (« Vos questions ») and from what the product does today.
 */
export const HELP_THEMES: HelpTheme[] = [
  {
    id: "demarrer",
    title: "Démarrer",
    entries: [
      {
        question: "Je ne suis pas technique. C'est pour moi ?",
        answer:
          "Oui. Vous collez une adresse dans votre outil de vente, puis un code sur votre page. Chaque étape a son guide, pas à pas.",
      },
      {
        question: "Combien de temps avant le premier témoignage ?",
        answer: `Le délai choisi pour l'offre : ${DEFAULT_REQUEST_DELAY_DAYS} jours par défaut. Vous pouvez aussi demander un avis tout de suite à un client que vous saisissez à la main.`,
      },
    ],
    guideSlug: "recolter-des-temoignages-clients-formation-en-ligne",
  },
  {
    id: "connecteurs",
    title: "Connecteurs",
    entries: [
      {
        question: "Mon outil n'est pas dans la liste.",
        answer:
          "Reliez-le avec Zapier, Make ou n8n, grâce au connecteur universel. Make propose un plan gratuit. Et dites-nous lequel, sur la page des intégrations : un outil demandé trois fois passe en « Bientôt ».",
      },
      {
        question: "Que veut dire « Bientôt » ?",
        answer:
          "Le connecteur est prévu, sans date promise : nous le construisons à partir de vraies ventes de test. En attendant, votre outil se relie avec Zapier ou Make. « Me prévenir », sur sa page, vous écrit une seule fois, le jour de sa sortie.",
      },
    ],
    guideSlug: "envoyer-vos-ventes-avec-zapier",
  },
  {
    id: "demandes",
    title: "Demandes",
    entries: [
      REQUEST_TIMING,
      {
        question: "Mes clients vont-ils être dérangés ?",
        answer:
          "Non. Deux e-⁠mails au plus par client et par offre : la demande et une relance. Chacun contient un lien de désinscription. Les réponses arrivent chez vous.",
      },
    ],
  },
  {
    id: "widgets",
    title: "Widgets",
    entries: [
      SITE_COMPATIBILITY,
      {
        question: "Le widget peut-il abîmer ma page ?",
        answer:
          "Non. Il s'affiche dans son propre cadre, sans toucher au reste de votre page, et ne la fait pas sauter pendant le chargement. Pour le retirer, vous supprimez le code.",
      },
    ],
    guideSlug: "ajouter-des-temoignages-sur-une-page-systeme-io",
  },
  {
    id: "abonnement",
    title: "Abonnement",
    entries: [
      VAT,
      {
        question: "Que se passe-t-il si je dépasse une limite ?",
        answer: `Rien n'est supprimé. Au plan ${free.name}, au-delà de ${free.limits.testimonials} témoignages validés, les nouveaux attendent dans votre espace. Au-delà de ${free.limits.monthlyRequests} demandes dans le mois, les suivantes partent le 1er du mois suivant. Le plan ${essentiel.name} lève ces limites.`,
      },
      RESIGN,
    ],
  },
  {
    id: "donnees-personnelles",
    title: "Données personnelles",
    entries: [
      GDPR,
      {
        question: "Puis-je exporter ou supprimer mes données ?",
        answer:
          "Oui, depuis Mon compte. « Exporter mes données » prépare un fichier avec votre espace, vos offres, vos clients et vos témoignages. « Supprimer mon espace » efface tout, immédiatement et définitivement.",
      },
    ],
    guideSlug: "temoignages-clients-rgpd-formateur",
  },
];
