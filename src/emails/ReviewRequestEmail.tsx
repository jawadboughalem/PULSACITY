import { Text } from "react-email";
import type { PurchaseEventType } from "@/lib/connectors/types";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { formatPostalAddressLine } from "@/lib/spaces/space-settings-schema";
import {
  CustomerEmailButton,
  CustomerEmailLayout,
  type CustomerEmailSpace,
  CustomerFallbackLink,
  customerSignatureStyle,
} from "./CustomerEmailLayout";
import { creatorParagraphStyle } from "./creator-email-styles";

export type ReviewEmailKind = "request" | "reminder";

/** A fixed label of the charter, without « (1 minute) »: no duration of entry (maquettes 3.6). */
export const REVIEW_BUTTON_LABEL = "Donner mon avis";

export type ReviewRequestEmailProps = {
  kind: ReviewEmailKind;
  /** The creator: name, logo, accent on the button, postal address at the bottom. */
  space: CustomerEmailSpace;
  firstName: string | null;
  productName: string;
  eventType: PurchaseEventType | null;
  purchasedAt: Date;
  reviewUrl: string;
  unsubscribeUrl: string;
};

/** « Camille, votre avis sur Programme 30 jours ? »; the reminder, « Camille, un mot sur Programme 30 jours ? ». */
export const buildReviewEmailSubject = (kind: ReviewEmailKind, firstName: string | null, productName: string): string => {
  const question = kind === "request" ? `votre avis sur ${productName}` : `un mot sur ${productName}`;
  const sentence = firstName ? `${firstName}, ${question}` : question.charAt(0).toUpperCase() + question.slice(1);
  return `${sentence}${NO_BREAK_SPACE}?`;
};

const buildReason = (spaceName: string, productName: string, eventType: PurchaseEventType | null, purchasedAt: Date) =>
  eventType === "enrollment"
    ? `vous avez rejoint ${productName} auprès de ${spaceName} le ${formatDayMonthYear(purchasedAt)}.`
    : `vous avez acheté ${productName} auprès de ${spaceName} le ${formatDayMonthYear(purchasedAt)}.`;

/** The words of the e-mail, shared by its HTML and its text version, so that they never drift apart. */
const describeReviewEmail = ({ kind, space, firstName, productName, eventType, purchasedAt }: ReviewRequestEmailProps) => {
  const reason = buildReason(space.name, productName, eventType, purchasedAt);
  return {
    greeting: firstName ? `Bonjour ${firstName},` : "Bonjour,",
    paragraphs:
      kind === "request"
        ? [
            `Merci d'avoir suivi ${productName}.`,
            `Votre avis compte beaucoup pour moi${NO_BREAK_SPACE}: il m'aide à progresser, et il aide d'autres personnes à se lancer.`,
            "Une note et quelques mots suffisent.",
          ]
        : [
            `Je reviens vers vous une seule fois, sans insister. Votre avis sur ${productName} m'aiderait beaucoup.`,
          ],
    closing: kind === "request" ? "Merci d'avance," : "Belle journée,",
    preview:
      kind === "request"
        ? `Merci d'avoir suivi ${productName}. Une note et quelques mots suffisent.`
        : `Sans insister${NO_BREAK_SPACE}: votre avis m'aiderait beaucoup. C'est mon dernier message à ce sujet.`,
    notice:
      kind === "request"
        ? `Vous recevez cet e-⁠mail parce que ${reason}`
        : `C'est le dernier message à ce sujet. Vous le recevez parce que ${reason}`,
    reason,
  };
};

/**
 * Maquettes 3.6, « Version texte de la demande »: written by hand, in the order of the e-mail, without the initials of
 * the logo nor the link twice; the address of the way out, /desinscription/{code}, readable.
 */
export const buildReviewEmailText = (props: ReviewRequestEmailProps): string => {
  const words = describeReviewEmail(props);
  return [
    words.greeting,
    ...words.paragraphs,
    `${REVIEW_BUTTON_LABEL}${NO_BREAK_SPACE}:\n${props.reviewUrl}`,
    `${words.closing}\n${props.space.name}`,
    [
      "--",
      words.notice,
      `Ne plus recevoir ces e-⁠mails${NO_BREAK_SPACE}:\n${props.unsubscribeUrl}`,
      `Envoyé avec PULSACITY pour ${props.space.name}`,
      ...(props.space.senderPostalAddress ? [formatPostalAddressLine(props.space.senderPostalAddress)] : []),
    ].join("\n"),
  ].join("\n\n");
};

/**
 * Maquettes 3.6, « Demande d'avis » and « Relance »: in the creator's name, their logo and name on top, their accent on
 * the button; the one reminder four days later, without a duration.
 */
export const ReviewRequestEmail = (props: ReviewRequestEmailProps) => {
  const words = describeReviewEmail(props);
  return (
    <CustomerEmailLayout
      space={props.space}
      preview={words.preview}
      reason={words.reason}
      notice={words.notice}
      unsubscribeUrl={props.unsubscribeUrl}
    >
      <Text style={creatorParagraphStyle}>{words.greeting}</Text>
      {words.paragraphs.map((paragraph, index) => (
        <Text
          key={paragraph}
          style={index === words.paragraphs.length - 1 ? { ...creatorParagraphStyle, marginBottom: "28px" } : creatorParagraphStyle}
        >
          {paragraph}
        </Text>
      ))}
      <CustomerEmailButton href={props.reviewUrl} label={REVIEW_BUTTON_LABEL} accentColor={props.space.accentColor} />
      <CustomerFallbackLink href={props.reviewUrl} />
      <Text style={{ ...creatorParagraphStyle, margin: "8px 0 4px" }}>{words.closing}</Text>
      <Text style={customerSignatureStyle}>{props.space.name}</Text>
    </CustomerEmailLayout>
  );
};
