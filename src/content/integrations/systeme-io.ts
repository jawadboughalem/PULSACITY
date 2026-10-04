import { DEFAULT_REQUEST_DELAY_DAYS, REMINDER_DELAY_DAYS } from "@/lib/requests/request-timing";
import { MAX_REQUEST_DELAY_DAYS, MIN_REQUEST_DELAY_DAYS } from "@/lib/spaces/product-rules";
import type { AvailableIntegration } from "./types";

/**
 * The main page of the launch: « Témoignages automatiques pour Systeme.io ». The steps repeat those of the space
 * (Connecteurs › Systeme.io, Widgets), with the labels of Systeme.io captured on 27 September 2026.
 */
export const SYSTEME_IO: AvailableIntegration = {
  status: "available",
  slug: "systeme-io",
  name: "Systeme.io",
  summary: "Formations, coachings et tunnels de vente : une demande d'avis après chaque vente.",
  seo: {
    title: "Témoignages automatiques pour Systeme.io",
    description:
      "Chaque vente Systeme.io devient une demande d'avis à votre nom, puis un témoignage sur votre page de vente. Guide d'installation complet, sans code.",
  },
  heading: "Témoignages automatiques pour Systeme.io",
  intro:
    "Chaque vente sur Systeme.io déclenche une demande d'avis, envoyée à votre nom au moment choisi. Vous validez, et le témoignage s'affiche sur votre page Systeme.io. Deux minutes d'installation, rien à coder.",
  benefits: [
    {
      title: "Une demande après chaque vente",
      text: `Systeme.io nous prévient de chaque vente. La demande part ${DEFAULT_REQUEST_DELAY_DAYS} jours plus tard, ou au délai choisi pour l'offre. Sans réponse, une seule relance, ${REMINDER_DELAY_DAYS} jours après.`,
    },
    {
      title: "À votre nom, dans leur boîte de réception",
      text: "L'e-mail porte le nom de votre espace, et les réponses arrivent chez vous. Chaque client peut se désinscrire en un clic.",
    },
    {
      title: "Sur vos pages Systeme.io",
      text: "Collé une fois dans un élément Code HTML, le widget affiche chaque nouvel avis validé. Il reprend la police et la couleur de votre page.",
    },
  ],
  installSteps: [
    {
      title: "Créez votre espace PULSACITY",
      text: [
        "Indiquez votre adresse e-mail : un lien vous permet d'entrer, sans mot de passe. Donnez à votre espace le nom que vos clients connaissent, puis ajoutez vos offres : formation, accompagnement, séance.",
      ],
    },
    {
      title: "Copiez votre adresse de connexion et sa clé",
      text: [
        "Dans votre espace, ouvrez ",
        { strong: "Connecteurs" },
        ", puis ",
        { strong: "Systeme.io" },
        ". Copiez l'adresse de connexion, puis la clé secrète. Elles vous sont propres : ne les partagez pas.",
      ],
    },
    {
      title: "Collez-les dans Systeme.io",
      text: ["Ouvrez Systeme.io dans un autre onglet, de préférence sur un ordinateur, et suivez ces trois écrans."],
      illustration: "systeme-webhook-screens",
    },
    {
      title: "Faites une vente test, ou attendez la prochaine",
      text: [
        "Le voyant de la page Systeme.io de votre espace passe au vert dès la première vente reçue. Pour tester sans payer, achetez votre offre avec un code promo à 100 %.",
      ],
    },
    {
      title: "Associez chaque produit à une offre",
      text: [
        "Chaque produit vendu arrive dans ",
        { strong: "Offres à associer" },
        `. Choisissez l'offre qui lui correspond et le délai de la demande : de ${MIN_REQUEST_DELAY_DAYS} à ${MAX_REQUEST_DELAY_DAYS} jours après l'achat. Les ventes reçues entre-temps ne sont pas perdues : leur demande part au délai choisi.`,
      ],
    },
    {
      title: "Collez le widget sur votre page de vente",
      text: [
        "Dans ",
        { strong: "Widgets" },
        ", choisissez un mur, un carrousel ou un badge, puis ",
        { strong: "Copier le code" },
        ". Dans l'éditeur de votre page Systeme.io :",
      ],
      illustration: "paste-widget-screens",
    },
  ],
  optionalStep: {
    title: "Facultatif : les inscriptions sans vente",
    text: [
      "Vous offrez une formation ? Systeme.io n'y voit pas de vente. Une règle d'automatisation nous prévient quand même de chaque inscription, à la même adresse : dans Systeme.io, ",
      { strong: "Automatisations" },
      ", puis ",
      { strong: "Règles" },
      " et ",
      { strong: "Créer" },
      ".",
    ],
    illustration: "systeme-enrollment-rule",
  },
  afterInstall:
    "Ensuite, tout se fait seul. Chaque avis reçu arrive « En attente » dans votre espace : un clic sur « Valider », et il rejoint votre page.",
  faq: [
    {
      question: "Faut-il un plan payant Systeme.io ?",
      answer:
        "Non. Les webhooks des paramètres existent dès le plan gratuit de Systeme.io. Les inscriptions sans vente demandent une règle d'automatisation : le plan gratuit en permet une.",
    },
    {
      question: "Et mes clients d'avant la connexion ?",
      answer:
        "Systeme.io ne renvoie pas les ventes passées. Pour ces clients, « Demander un avis » envoie la même demande, client par client. Les témoignages déjà reçus s'importent depuis un fichier CSV.",
    },
    {
      question: "Que se passe-t-il quand une vente est remboursée ?",
      answer:
        "La demande attend son délai avant de partir. D'ici là, annulez-la d'un clic dans la page Demandes de votre espace.",
    },
    {
      question: "Les e-mails partent-ils à mon nom ?",
      answer:
        "Oui. Ils portent le nom de votre espace, et les réponses arrivent dans votre boîte. Ils partent d'une adresse technique de PULSACITY, pour bien arriver en boîte de réception.",
    },
    {
      question: "Le widget ralentit-il ma page ?",
      answer:
        "Non. C'est un seul petit fichier, chargé après votre page, qui réserve sa place pour que rien ne se décale. Sur une vraie page Systeme.io, PageSpeed Insights ne mesure aucun effet du widget.",
    },
  ],
  relatedGuide: "ajouter-des-temoignages-sur-une-page-systeme-io",
};
