import { guidePath, integrationPath } from "@/components/marketing/marketing-paths";
import type { MeanwhileItem, UpcomingIntegration } from "./types";

const UNIVERSAL_SLUG = "connecteur-universel";

const UNIVERSAL_LINK = { href: integrationPath(UNIVERSAL_SLUG), label: "Voir le connecteur universel" };

/** /integrations, « Sans connecteur, ça marche déjà » (maquettes 3.5): three white cards, each under its icon. */
export const WITHOUT_CONNECTOR: MeanwhileItem[] = [
  {
    icon: "email",
    title: "Demander un avis",
    text: "Depuis votre espace, envoyez une demande à un client, une à la fois. Son nom et son adresse e-⁠mail suffisent.",
  },
  {
    icon: "connection",
    title: "Votre lien de collecte",
    text: "Un lien à votre nom, à partager où vous voulez : e-⁠mail, message, groupe de clients. L'avis se laisse depuis un téléphone.",
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

/** Its guide step by step when it has one, the page of the universal connector otherwise. */
const readMeanwhileLink = (integration: UpcomingIntegration): NonNullable<MeanwhileItem["link"]> =>
  integration.guideSlug ? { href: guidePath(integration.guideSlug), label: "Lire le guide pas à pas" } : UNIVERSAL_LINK;

/** « En attendant : avec Zapier ou Make » (decisions/connecteurs.md): the line under a tool to come, and its first way. */
export const describeMeanwhile = (integration: UpcomingIntegration): { line: string; item: MeanwhileItem } => {
  const link = readMeanwhileLink(integration);
  switch (integration.meanwhileVia ?? "zapier-or-make") {
    case "universal":
      return {
        line: "En attendant : avec le connecteur universel",
        item: {
          title: "Avec le connecteur universel",
          text: `${integration.name} envoie déjà vos ventes au connecteur universel : chacune déclenche une demande d'avis.`,
          link,
        },
      };
    case "zapier":
      return {
        line: "En attendant : avec Zapier",
        item: {
          title: "Avec Zapier",
          text: `${integration.name}, puis Zapier, puis votre connecteur universel : chaque vente devient une demande d'avis dès aujourd'hui.`,
          link,
        },
      };
    case "zapier-or-make":
      return {
        line: "En attendant : avec Zapier ou Make",
        item: {
          title: "Avec Zapier ou Make",
          text: `${integration.name}, puis Zapier ou Make, puis votre connecteur universel : chaque vente devient une demande d'avis dès aujourd'hui. Make propose un plan gratuit.`,
          link,
        },
      };
  }
};
