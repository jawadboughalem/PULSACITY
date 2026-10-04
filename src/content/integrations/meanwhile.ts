import type { MeanwhileItem } from "./types";

/** /integrations, « Votre outil n'est pas encore là ? » (m21): three columns, each under its icon. */
export const WITHOUT_CONNECTOR: MeanwhileItem[] = [
  {
    icon: "email",
    title: "Demander un avis",
    text: "Depuis votre espace, envoyez une demande à un client, une à la fois. Son nom et son adresse e-mail suffisent.",
  },
  {
    icon: "connection",
    title: "Votre lien de collecte",
    text: "Un lien à votre nom, à partager où vous voulez : e-mail, message, groupe de clients. L'avis se laisse en deux minutes.",
  },
  {
    icon: "grid",
    title: "Le widget",
    text: "Il se colle sur toute page qui accepte un code HTML, et reprend votre police et votre couleur.",
  },
];

/** The page of a connector to come, « En attendant, sans connecteur » (m21): one row each. */
export const MEANWHILE: MeanwhileItem[] = [
  {
    title: "Demander un avis",
    text: "Depuis votre espace, une demande à la fois : un nom, une adresse e-mail, une offre. Idéal juste après une séance.",
  },
  {
    title: "Votre lien de collecte",
    text: "Un lien à votre nom, à glisser dans votre e-mail de suivi ou dans un message. L'avis se laisse en deux minutes.",
  },
  {
    title: "Vos avis déjà reçus",
    text: "Importez-les d'un fichier CSV, ou ajoutez à la main ceux reçus par message. Ils rejoignent les autres.",
  },
];
