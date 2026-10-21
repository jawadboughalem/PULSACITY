import { NO_BREAK_SPACE } from "@/lib/french/typography";

/** « /aide?sujet=signalement »: the address the legal texts give to report a content (CGU 7.4, mentions légales). */
export const REPORT_SUBJECT_PARAMETER = "sujet";

export const REPORT_SUBJECT_VALUE = "signalement";

/**
 * What a notice needs (règlement (UE) 2022/2065, article 16): where the content is, which one, and why it is illegal.
 * Typed in « Écrivez-nous » for the reader, who completes it; the answer goes to their address.
 */
export const REPORT_DRAFT = {
  subject: "Signaler un contenu",
  message: [
    `Page ou widget${NO_BREAK_SPACE}:`,
    `Contenu visé${NO_BREAK_SPACE}:`,
    `Pourquoi il est illicite${NO_BREAK_SPACE}:`,
    "",
  ].join("\n"),
} as const;

export type ContactDraft = { subject: string; message: string };

export const readContactDraft = (searchParams: Record<string, string | string[] | undefined>): ContactDraft | null => {
  const value = searchParams[REPORT_SUBJECT_PARAMETER];
  return (Array.isArray(value) ? value[0] : value) === REPORT_SUBJECT_VALUE ? REPORT_DRAFT : null;
};
