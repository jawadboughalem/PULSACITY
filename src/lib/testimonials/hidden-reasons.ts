/**
 * « Masquer » asks for a reason, sent to the author (positionnement.md, point 6; maquettes 3.4, fiche 04 et 05). A
 * testimonial hidden for one of them no longer counts in the rating of the badge (point 5). The list is the one Design
 * proposed: a lawyer confirms its form with the CGV (6.7).
 */
export const HIDDEN_REASONS = [
  "off-topic",
  "abusive",
  "personal-data",
  "not-a-customer",
  "author-request",
  "other",
] as const;

export type HiddenReason = (typeof HIDDEN_REASONS)[number];

/** In the creator's words: the choices of the window, and the reason the author receives as is. */
export const HIDDEN_REASON_LABELS: Record<HiddenReason, string> = {
  "off-topic": "Il ne parle pas de mon offre",
  abusive: "Il contient des propos insultants ou discriminants",
  "personal-data": "Il donne des informations personnelles",
  "not-a-customer": "Il ne vient pas d'un de mes clients",
  "author-request": "La personne m'a demandé de le retirer",
  other: "Autre motif",
};

/** In the reader's words, on « À propos de ces avis » (maquette 3.5). */
export const HIDDEN_REASON_PUBLIC_LABELS: Record<HiddenReason, string> = {
  "off-topic": "Il ne parle pas de l'offre achetée",
  abusive: "Il contient des propos insultants ou discriminants",
  "personal-data": "Il donne des informations personnelles",
  "not-a-customer": "Il ne vient pas d'un client du créateur",
  "author-request": "Son auteur a demandé qu'il soit retiré",
  other: "Autre motif, précisé à l'auteur",
};

/** « Autre motif » is said in a few words, sent as they are. */
export const MAX_HIDDEN_REASON_DETAIL_LENGTH = 200;

export const isHiddenReason = (value: unknown): value is HiddenReason =>
  typeof value === "string" && (HIDDEN_REASONS as readonly string[]).includes(value);

type StoredReason = { hiddenReason: HiddenReason | null; hiddenReasonDetail: string | null };

/** The reason as the author reads it: the chosen one, or the words typed for « Autre motif ». */
export const describeHiddenReason = ({ hiddenReason, hiddenReasonDetail }: StoredReason): string | null => {
  if (!hiddenReason) return null;
  if (hiddenReason === "other") return hiddenReasonDetail?.trim() || HIDDEN_REASON_LABELS.other;
  return HIDDEN_REASON_LABELS[hiddenReason];
};
