import { Column, Row, Section, Text } from "react-email";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { diffWords } from "@/lib/testimonials/corrections/diff-words";
import {
  CustomerEmailButton,
  CustomerEmailLayout,
  type CustomerEmailSpace,
  CustomerFallbackLink,
  customerQuoteBoxStyle,
  customerQuoteLabelStyle,
  customerQuoteTextStyle,
  customerSecondaryButtonStyle,
  customerSignatureStyle,
} from "./CustomerEmailLayout";
import { describeReviewReason } from "./HiddenReasonEmail";
import { creatorParagraphStyle, creatorSmallStyle } from "./creator-email-styles";

type CorrectionRequestEmailProps = {
  space: CustomerEmailSpace;
  firstName: string | null;
  productName: string | null;
  /** « Votre texte »: the text shown when the correction was proposed. */
  fromBody: string;
  /** « Le texte corrigé ». */
  body: string;
  reviewedAt: Date;
  /** The page where the author answers: the two buttons lead there, nothing is decided by the link alone. */
  answerUrl: string;
  unsubscribeUrl: string;
};

/** « Camille, puis-je corriger votre avis ? » (maquette 3.6). */
export const buildCorrectionRequestSubject = (firstName: string | null): string =>
  firstName ? `${firstName}, puis-je corriger votre avis${NO_BREAK_SPACE}?` : `Puis-je corriger votre avis${NO_BREAK_SPACE}?`;

const quoted = (text: string) => `«${NO_BREAK_SPACE}${text.trim()}${NO_BREAK_SPACE}»`;

/**
 * Maquette 3.6, « Demande d'accord pour une correction » (positionnement.md, point 4): both versions one under the
 * other, the passage changed in bold, underlined (readable without colour). Without an answer, the original stays.
 */
export const CorrectionRequestEmail = ({
  space,
  firstName,
  productName,
  fromBody,
  body,
  reviewedAt,
  answerUrl,
  unsubscribeUrl,
}: CorrectionRequestEmailProps) => {
  const segments = diffWords(fromBody.trim(), body.trim());
  return (
    <CustomerEmailLayout
      space={space}
      preview="Rien ne change sans votre accord. Votre texte d'origine reste gardé."
      reason={describeReviewReason(space.name, productName, reviewedAt)}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Text style={creatorParagraphStyle}>{firstName ? `Bonjour ${firstName},` : "Bonjour,"}</Text>
      <Text style={creatorParagraphStyle}>
        {productName ? `Merci encore pour votre avis sur ${productName}.` : "Merci encore pour votre avis."}
      </Text>
      <Text style={creatorParagraphStyle}>
        {`J'aimerais corriger une faute dans le texte affiché sur mes pages. Voici les deux versions${NO_BREAK_SPACE}:`}
      </Text>
      <Section style={customerQuoteBoxStyle}>
        <Text style={customerQuoteLabelStyle}>Votre texte</Text>
        <Text style={customerQuoteTextStyle}>{quoted(fromBody)}</Text>
      </Section>
      <Section style={{ ...customerQuoteBoxStyle, margin: "0 0 20px" }}>
        <Text style={customerQuoteLabelStyle}>Le texte corrigé</Text>
        <Text style={customerQuoteTextStyle}>
          {`«${NO_BREAK_SPACE}`}
          {segments.map((segment, index) =>
            segment.isChanged ? (
              <strong key={index} style={{ fontWeight: 700, textDecoration: "underline" }}>
                {segment.text}
              </strong>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
          {`${NO_BREAK_SPACE}»`}
        </Text>
      </Section>
      <Text style={creatorParagraphStyle}>Rien ne change sans votre accord. Votre texte d&apos;origine reste gardé.</Text>
      <Row className="customer-email-actions" style={{ width: "auto" }}>
        <Column style={{ paddingRight: "12px" }}>
          <CustomerEmailButton href={answerUrl} label="Accepter la correction" accentColor={space.accentColor} />
        </Column>
        <Column>
          <a className="customer-email-button" href={answerUrl} style={customerSecondaryButtonStyle}>
            Garder mon texte
          </a>
        </Column>
      </Row>
      <CustomerFallbackLink href={answerUrl} />
      <Text style={creatorSmallStyle}>Sans réponse de votre part, votre texte d&apos;origine reste affiché.</Text>
      <Text style={{ ...creatorParagraphStyle, margin: "8px 0 4px" }}>Merci,</Text>
      <Text style={customerSignatureStyle}>{space.name}</Text>
    </CustomerEmailLayout>
  );
};
