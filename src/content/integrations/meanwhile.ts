import { integrationPath } from "@/components/marketing/marketing-paths";
import type { MeanwhileItem, UpcomingIntegration } from "./types";

const UNIVERSAL_SLUG = "connecteur-universel";

const UNIVERSAL_LINK = { href: integrationPath(UNIVERSAL_SLUG), label: "Voir le connecteur universel" };

/** /integrations, « Votre outil n'est pas encore là ? » (m21): three columns, each under its icon. */
export const WITHOUT_CONNECTOR: MeanwhileItem[] = [
  {
    icon: "connection",
    title: "Avec Zapier, Make ou n8n",
    text: "Le connecteur universel reçoit les ventes de n'importe quel outil : chacune déclenche une demande d'avis, comme avec Systeme.io.",
    link: UNIVERSAL_LINK,
  },
  {
    icon: "email",
    title: "Demander un avis",
    text: "Depuis votre espace, envoyez une demande à un client, une à la fois. Son nom et son adresse e-⁠mail suffisent.",
  },
  {
    icon: "share",
    title: "Votre lien de collecte",
    text: "Un lien à votre nom, à partager où vous voulez : e-⁠mail, message, groupe de clients. L'avis se laisse depuis un téléphone.",
  },
];

/** The page of a connector to come, « En attendant, sans connecteur » (m21): one row each. */
export const MEANWHILE: MeanwhileItem[] = [
  {
    title: "Demander un avis",
    text: "Depuis votre espace, une demande à la fois : un nom, une adresse e-⁠mail, une offre. Idéal juste après une séance.",
  },
  {
    title: "Votre lien de collecte",
    text: "Un lien à votre nom, à glisser dans votre e-⁠mail de suivi ou dans un message. L'avis se laisse depuis un téléphone.",
  },
  {
    title: "Vos avis déjà reçus",
    text: "Importez-les d'un fichier CSV, ou ajoutez à la main ceux reçus par message. Ils rejoignent les autres.",
  },
];

/** « En attendant : avec Zapier ou Make » (decisions/connecteurs.md): the line under a tool to come, and its first way. */
export const describeMeanwhile = (integration: UpcomingIntegration): { line: string; item: MeanwhileItem } => {
  switch (integration.meanwhileVia ?? "zapier-or-make") {
    case "universal":
      return {
        line: "En attendant : avec le connecteur universel",
        item: {
          title: "Avec le connecteur universel",
          text: `${integration.name} envoie déjà vos ventes au connecteur universel : chacune déclenche une demande d'avis.`,
          link: UNIVERSAL_LINK,
        },
      };
    case "zapier":
      return {
        line: "En attendant : avec Zapier",
        item: {
          title: "Avec Zapier",
          text: `Envoyez dès aujourd'hui vos ventes ${integration.name} au connecteur universel, avec Zapier : chacune déclenche une demande d'avis.`,
          link: UNIVERSAL_LINK,
        },
      };
    case "zapier-or-make":
      return {
        line: "En attendant : avec Zapier ou Make",
        item: {
          title: "Avec Zapier ou Make",
          text: `Envoyez dès aujourd'hui vos ventes ${integration.name} au connecteur universel, avec Zapier ou Make : chacune déclenche une demande d'avis.`,
          link: UNIVERSAL_LINK,
        },
      };
  }
};
