import { readConnectorName } from "@/lib/connectors/registry";
import { formatDateTime, formatDayMonthYear } from "@/lib/dates/format-french-date";
import type { TestimonialDetail } from "./load-testimonial-detail";
import { type TestimonialProvenance, hasKnownPurchase } from "./testimonial-provenance";

const SOURCE_NAMES = {
  form: "page de collecte, remplie par l'auteur",
  manual: "ajout manuel par le créateur de l'espace",
  csv: "import d'un fichier CSV par le créateur de l'espace",
} as const;

const CONSENT_GIVERS = {
  form: "l'auteur, en cochant la case du formulaire",
  manual: "le créateur de l'espace, qui atteste avoir l'accord de l'auteur",
  csv: "le créateur de l'espace, qui atteste avoir l'accord de chaque auteur du fichier",
} as const;

const describeProvenance = (provenance: TestimonialProvenance, connector: string | null): string => {
  if (provenance === "sale") return connector ? `vente reçue de ${readConnectorName(connector)}` : "vente reçue";
  return {
    request: "demande manuelle, envoyée par le créateur de l'espace à un client saisi par lui",
    added: "ajout par le créateur de l'espace",
    import: "import d'un fichier par le créateur de l'espace",
    "public-link": "lien de collecte public, sans demande",
  }[provenance];
};

/** A plain text record the creator can keep or hand over: who agreed, to what, and when. */
export const buildConsentProof = (spaceName: string, testimonial: TestimonialDetail, now = new Date()): string =>
  [
    "PULSACITY — preuve de consentement à la publication d'un témoignage",
    "",
    `Espace : ${spaceName}`,
    `Témoignage : ${testimonial.id}`,
    `Auteur : ${testimonial.authorName}${testimonial.authorTitle ? `, ${testimonial.authorTitle}` : ""}`,
    `Reçu le : ${formatDateTime(testimonial.createdAt)} (heure de Paris)`,
    `Source : ${SOURCE_NAMES[testimonial.source]}${
      testimonial.provenance === "sale" && testimonial.purchaseConnector
        ? `, après une vente ${readConnectorName(testimonial.purchaseConnector)}`
        : ""
    }`,
    `Provenance : ${describeProvenance(testimonial.provenance, testimonial.purchaseConnector)}`,
    `Achat du : ${
      testimonial.purchasedAt && hasKnownPurchase(testimonial.provenance)
        ? formatDayMonthYear(testimonial.purchasedAt)
        : "date inconnue"
    }`,
    "",
    testimonial.consentAt
      ? `Consentement donné le : ${formatDateTime(testimonial.consentAt)} (heure de Paris), ${testimonial.consentAt.toISOString()}`
      : "Consentement : aucun consentement enregistré",
    `Donné par : ${CONSENT_GIVERS[testimonial.source]}`,
    `Texte accepté : « ${testimonial.consentText ?? ""} »`,
    "",
    "Texte original, conservé tel quel :",
    testimonial.body,
    "",
    `Document établi le ${formatDateTime(now)} (heure de Paris).`,
    "",
  ].join("\n");
