import { Link, Section, Text } from "react-email";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import {
  CustomerEmailLayout,
  type CustomerEmailSpace,
  customerQuoteBoxStyle,
  customerSignatureStyle,
} from "./CustomerEmailLayout";
import { CREATOR_EMAIL_COLORS, creatorLinkStyle, creatorParagraphStyle, creatorSmallStyle } from "./creator-email-styles";

type HiddenReasonEmailProps = {
  space: CustomerEmailSpace;
  firstName: string | null;
  productName: string | null;
  /** The reason as chosen in « Masquer », in the creator's words, or the words of « Autre motif ». */
  reason: string;
  reviewedAt: Date;
  aboutUrl: string;
  unsubscribeUrl: string;
};

/**
 * « Nadia, votre avis n'est pas affiché »: the maquette says « n'est plus affiché », untrue of a testimonial hidden
 * while it waited for validation, never shown.
 */
export const buildHiddenReasonSubject = (firstName: string | null): string =>
  firstName ? `${firstName}, votre avis n'est pas affiché` : "Votre avis n'est pas affiché";

export const describeReviewReason = (spaceName: string, productName: string | null, reviewedAt: Date): string =>
  `vous avez laissé un avis${productName ? ` sur ${productName}` : ""} auprès de ${spaceName} le ${formatDayMonthYear(reviewedAt)}.`;

/**
 * Maquette 3.6, « Motif d'un avis masqué » (positionnement.md, point 6): the reason, as is, in the creator's name. No
 * button: nothing to do but answer. Its form waits for a lawyer (6.7).
 */
export const HiddenReasonEmail = ({
  space,
  firstName,
  productName,
  reason,
  reviewedAt,
  aboutUrl,
  unsubscribeUrl,
}: HiddenReasonEmailProps) => (
  <CustomerEmailLayout
    space={space}
    preview="Il reste gardé. Voici pourquoi."
    reason={describeReviewReason(space.name, productName, reviewedAt)}
    unsubscribeUrl={unsubscribeUrl}
  >
    <Text style={creatorParagraphStyle}>{firstName ? `Bonjour ${firstName},` : "Bonjour,"}</Text>
    <Text style={creatorParagraphStyle}>
      {productName ? `Merci pour votre avis sur ${productName}.` : "Merci pour votre avis."}
    </Text>
    <Text style={creatorParagraphStyle}>
      {`Je ne l'affiche pas sur mes pages, pour ce motif${NO_BREAK_SPACE}:`}
    </Text>
    <Section style={{ ...customerQuoteBoxStyle, margin: "0 0 20px", padding: "20px 24px" }}>
      <Text style={{ ...creatorParagraphStyle, margin: 0, fontWeight: 700, color: CREATOR_EMAIL_COLORS.ink }}>{reason}</Text>
    </Section>
    <Text style={creatorParagraphStyle}>
      {`Votre avis n'est pas supprimé${NO_BREAK_SPACE}: je peux l'afficher à nouveau à tout moment.`}
    </Text>
    <Text style={creatorParagraphStyle}>{`Une question${NO_BREAK_SPACE}? Répondez simplement à cet e-⁠mail.`}</Text>
    <Text style={creatorSmallStyle}>
      {`Comment mes avis sont recueillis et affichés${NO_BREAK_SPACE}: `}
      <Link href={aboutUrl} style={creatorLinkStyle}>
        À propos de ces avis
      </Link>
    </Text>
    <Text style={{ ...creatorParagraphStyle, margin: "8px 0 4px" }}>Belle journée,</Text>
    <Text style={customerSignatureStyle}>{space.name}</Text>
  </CustomerEmailLayout>
);
