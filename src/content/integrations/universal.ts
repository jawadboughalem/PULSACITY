import type { AvailableIntegration } from "./types";

/**
 * Every other tool, maquette 21 on the model of Systeme.io: an address of the space that receives the sales of any
 * tool, directly or with Zapier, Make or n8n, in the format of src/lib/connectors/universal/fields.ts.
 */
export const UNIVERSAL: AvailableIntegration = {
  status: "available",
  slug: "connecteur-universel",
  name: "Connecteur universel",
  family: "other-tools",
  hasSigningKey: false,
  summary: "Envoyez vos ventes depuis n'importe quel outil : une demande d'avis part pour chacune.",
  seo: {
    title: "Témoignages automatiques depuis n'importe quel outil",
    description:
      "Zapier, Make, n8n ou votre propre outil : chaque vente envoyée au connecteur universel devient une demande d'avis à votre nom.",
  },
  heading: "Témoignages automatiques depuis n'importe quel outil",
  intro:
    "Votre outil n'a pas encore son connecteur ? Envoyez vos ventes à une adresse propre à votre espace, directement ou avec Zapier, Make ou n8n. Chacune déclenche une demande d'avis à votre nom.",
  benefits: [
    {
      title: "Tous vos outils",
      text: "Zapier, Make et n8n relient des milliers d'outils. Make le fait même avec son plan gratuit.",
    },
    {
      title: "Jamais deux fois",
      text: "Une vente reçue deux fois ne compte qu'une fois. Un client reçu par deux connecteurs en 48 heures ne reçoit qu'une demande.",
    },
    {
      title: "Rien ne s'affiche sans vous",
      text: "Vous relisez chaque avis avant de le valider. Validé, il rejoint le widget de votre page de vente.",
    },
  ],
  installTitle: "Installer le connecteur universel, pas à pas",
  finalCall: "Reliez votre outil : la prochaine vente fait le reste.",
  installIntro: "Cinq étapes, plus simples depuis un ordinateur. Gardez votre outil ouvert dans un autre onglet.",
  installSteps: [
    {
      title: "Créer votre espace",
      text: ["C'est gratuit. Une adresse e-⁠mail suffit : vous recevez un lien pour entrer, sans mot de passe."],
    },
    {
      title: "Copier votre adresse",
      text: [
        "Dans votre espace, ouvrez Connecteurs, puis Connecteur universel. L'adresse vous est propre : ne la partagez pas.",
      ],
      illustration: "connection-address",
    },
    {
      title: "Envoyer vos ventes à cette adresse",
      text: [
        "Dans Zapier, Make, n8n ou votre outil, ajoutez une étape qui envoie à l'adresse, pour chaque vente, ces champs. Seule l'adresse e-⁠mail du client est obligatoire.",
      ],
      illustration: "universal-fields",
    },
    {
      title: "Envoyer une vente de test",
      text: ["Envoyez une vente avec votre propre adresse e-⁠mail. Dès qu'elle arrive, le voyant de la page passe au vert."],
      illustration: "connection-success",
    },
    {
      title: "Associer vos offres",
      text: [
        "Chaque offre reçue apparaît avec sa première vente. Indiquez à quelle offre PULSACITY elle correspond, et quand demander l'avis. Tant qu'elle n'est pas associée, ses ventes sont gardées de côté.",
      ],
    },
  ],
  faq: [
    {
      question: "Faut-il un compte Zapier, Make ou n8n ?",
      answer:
        "Non, si votre outil sait déjà envoyer chaque vente à une adresse (on parle souvent de webhook). Sinon, Make le fait avec son plan gratuit ; Zapier demande un plan payant pour cette étape.",
    },
    {
      question: "Que se passe-t-il si une vente arrive deux fois ?",
      answer:
        "Elle ne compte qu'une fois, si elle porte sa référence : l'identifiant de la vente dans votre outil. Et un client reçu par deux connecteurs en 48 heures ne reçoit qu'une demande.",
    },
    {
      question: "Et si l'offre n'existe pas encore dans PULSACITY ?",
      answer:
        "La vente attend dans « Offres à associer », sur la page du connecteur. Associez-la à une offre, et la demande part au délai choisi pour cette offre.",
    },
    {
      question: "Mes ventes passées sont-elles prises en compte ?",
      answer:
        "Seules les ventes que votre outil envoie après l'installation déclenchent une demande. Pour vos clients passés, envoyez des demandes depuis votre espace, une à la fois.",
    },
  ],
};
