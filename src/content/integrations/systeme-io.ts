import type { AvailableIntegration } from "./types";

/**
 * The main page of the launch, maquette 21: « Témoignages automatiques pour Systeme.io ». The steps follow the space
 * (Connecteurs › Systeme.io, Widgets), with the labels of Systeme.io captured on 27 September 2026.
 */
export const SYSTEME_IO: AvailableIntegration = {
  status: "available",
  slug: "systeme-io",
  name: "Systeme.io",
  summary: "Formations, coachings et tunnels de vente. Chaque vente déclenche une demande d'avis.",
  seo: {
    title: "Témoignages automatiques pour Systeme.io",
    description:
      "Chaque vente Systeme.io devient une demande d'avis à votre nom, puis un témoignage sur votre page de vente. Guide d'installation complet, sans code.",
  },
  heading: "Témoignages automatiques pour Systeme.io",
  intro:
    "Après chaque vente sur Systeme.io, votre client reçoit une demande d'avis à votre nom. Vous validez, et son témoignage s'affiche sur votre page de vente.",
  benefits: [
    {
      title: "Rien à installer",
      text: "Une adresse et une clé à coller dans vos paramètres Systeme.io. Deux minutes, depuis votre ordinateur.",
    },
    {
      title: "Au bon moment, pour chaque offre",
      text: "Vous choisissez quand part la demande : 30 jours après l'achat d'un programme d'un mois, par exemple. Une seule relance, jamais plus.",
    },
    {
      title: "Rien ne s'affiche sans vous",
      text: "Vous relisez chaque avis avant de le valider. Validé, il rejoint le widget de votre page de vente.",
    },
  ],
  installIntro: "Six étapes, plus simples depuis un ordinateur. Gardez Systeme.io ouvert dans un autre onglet.",
  installSteps: [
    {
      title: "Créer votre espace",
      text: ["C'est gratuit. Une adresse e-⁠mail suffit : vous recevez un lien pour entrer, sans mot de passe."],
    },
    {
      title: "Copier votre adresse et votre clé",
      text: [
        "Dans votre espace, ouvrez Connecteurs, puis Systeme.io. L'adresse de connexion et la clé secrète vous sont propres : ne les partagez pas.",
      ],
      illustration: "connection-address",
    },
    {
      title: "Les coller dans Systeme.io",
      text: ["Ouvrez Systeme.io dans un autre onglet et suivez ces trois écrans."],
      illustration: "systeme-webhook-screens",
    },
    {
      title: "Faire une vente test",
      text: [
        "Achetez votre offre avec un code promo à 100 %. Dès que la vente arrive, le voyant de la page Systeme.io passe au vert.",
      ],
      illustration: "connection-success",
    },
    {
      title: "Associer vos produits à vos offres",
      text: [
        "Chaque produit Systeme.io apparaît avec sa première vente. Indiquez à quelle offre il correspond, et quand demander l'avis : 30 jours après l'achat, par exemple. Tant qu'il n'est pas associé, ses ventes sont gardées de côté.",
      ],
    },
    {
      title: "Coller le widget sur votre page de vente",
      text: ["Dans votre espace, ouvrez Widgets et copiez le code. Puis, dans Systeme.io :"],
      illustration: "paste-widget-screens",
    },
  ],
  optionalStep: {
    title: "Facultatif : les inscriptions sans vente",
    text: [
      "Vous offrez une formation ? Systeme.io n'y voit pas de vente. Une règle d'automatisation nous prévient quand même de chaque inscription.",
    ],
    illustration: "systeme-enrollment-rule",
    note: [
      "Dans Systeme.io : ",
      { strong: "Automatisations" },
      ", puis ",
      { strong: "Règles" },
      " et ",
      { strong: "Créer" },
      ". Chaque inscription arrive avec le nom de la formation. Associez-la à une offre, comme à l'étape 5.",
    ],
  },
  faq: [
    {
      question: "Mes ventes passées sont-elles prises en compte ?",
      answer:
        "Non : seules les ventes reçues après la connexion déclenchent une demande. Pour vos clients passés, envoyez des demandes depuis votre espace, une à la fois.",
    },
    {
      question: "Que se passe-t-il si une vente est annulée ?",
      answer:
        "Cochez « Vente annulée » à l'étape 3 : Systeme.io nous prévient alors de chaque remboursement, et nous le gardons. Bientôt, la demande prévue s'annulera seule, sans rien changer à votre réglage. En attendant, annulez-la depuis la page Demandes de votre espace.",
    },
    {
      question: "Et les formations offertes ?",
      answer:
        "Une inscription gratuite n'est pas une vente pour Systeme.io. Ajoutez la règle d'automatisation de l'étape facultative : chaque inscription déclenche alors une demande, comme une vente.",
    },
    {
      question: "De qui vient l'e-⁠mail que reçoit mon client ?",
      answer:
        "De vous : il porte le nom de votre espace, et les réponses arrivent dans votre boîte. Il part d'une adresse technique de PULSACITY, pour bien arriver en boîte de réception. Chaque e-⁠mail permet de se désinscrire en un clic.",
    },
    {
      question: "Puis-je changer d'adresse et de clé ?",
      answer:
        "Oui, depuis la page Systeme.io de votre espace : « Changer d'adresse et de clé ». Les anciennes cessent aussitôt de fonctionner : collez les nouvelles dans Systeme.io.",
    },
  ],
};
