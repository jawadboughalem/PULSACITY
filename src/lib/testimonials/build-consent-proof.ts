import { readConnectorName } from "@/lib/connectors/registry";
import { formatDateTime } from "@/lib/dates/format-french-date";
import type { TestimonialDetail } from "./load-testimonial-detail";

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
      testimonial.request?.connector ? `, après une vente ${readConnectorName(testimonial.request.connector)}` : ""
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
