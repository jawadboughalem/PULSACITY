import type { CSSProperties, ReactNode } from "react";
import { Body, Button, Column, Container, Head, Html, Img, Link, Preview, Row, Section, Text } from "react-email";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";
import { getInitials } from "@/lib/spaces/get-initials";
import { formatPostalAddressLine } from "@/lib/spaces/space-settings-schema";
import {
  CREATOR_EMAIL_COLORS,
  creatorButtonStyle,
  creatorCardStyle,
  creatorFallbackStyle,
  creatorLegalLineStyle,
  creatorLegalStyle,
  creatorLinkStyle,
  creatorPageStyle,
  creatorParagraphStyle,
} from "./creator-email-styles";

/**
 * Charte v2, « E-mails » and « E-mails, ajouts » (3.6): an e-mail to a creator's customer, in the creator's name: the
 * request and its reminder, the correction to agree to, the reason of a hidden testimonial.
 */
const SYSTEM_FONTS = "Helvetica, Arial, sans-serif";

const LOGO_SIZE = 44;

/** On a phone: padding 24, the buttons over the whole width, 56 high. */
export const CUSTOMER_EMAIL_MOBILE_STYLES = `
@media (max-width: 600px) {
  .customer-email-card > tbody > tr > td { padding: 24px !important; }
  .customer-email-legal > tbody > tr > td { padding: 0 24px !important; }
  .customer-email-button { display: block !important; padding-top: 18px !important; padding-bottom: 18px !important; text-align: center !important; }
  .customer-email-actions td { display: block !important; width: 100% !important; padding: 0 0 12px !important; }
}
`;

export type CustomerEmailSpace = {
  name: string;
  logoUrl: string | null;
  accentColor: string | null;
  /** Réglages: one line at the bottom, « Julie Martin · 12 rue des Lilas · 69003 Lyon ». */
  senderPostalAddress: string | null;
};

/** The creator's accent on the main button, its text Blanc at 4.5:1 or Encre; without an accent, Encre and Blanc. */
export const readCustomerButtonStyle = (accentColor: string | null): CSSProperties => {
  const colors = readAccentButtonColors(accentColor);
  return {
    ...creatorButtonStyle,
    backgroundColor: colors?.background ?? CREATOR_EMAIL_COLORS.ink,
    color: colors?.text ?? CREATOR_EMAIL_COLORS.white,
  };
};

/** The second action of an e-mail with two: bordered Encre 2 px. */
export const customerSecondaryButtonStyle: CSSProperties = {
  ...creatorButtonStyle,
  padding: "12px 26px",
  border: `2px solid ${CREATOR_EMAIL_COLORS.ink}`,
  backgroundColor: CREATOR_EMAIL_COLORS.white,
  color: CREATOR_EMAIL_COLORS.ink,
};

export const customerSignatureStyle: CSSProperties = {
  ...creatorParagraphStyle,
  margin: 0,
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: 700,
};

/** A text quoted on Nuage, radius 16, with its label 13/18 700 Gris (the two versions of a correction, a reason). */
export const customerQuoteBoxStyle: CSSProperties = {
  width: "100%",
  margin: "0 0 16px",
  padding: "16px 20px",
  borderRadius: "16px",
  backgroundColor: CREATOR_EMAIL_COLORS.cloud,
};

export const customerQuoteLabelStyle: CSSProperties = {
  margin: "0 0 6px",
  fontFamily: SYSTEM_FONTS,
  fontSize: "13px",
  lineHeight: "18px",
  fontWeight: 700,
  color: CREATOR_EMAIL_COLORS.gray,
};

export const customerQuoteTextStyle: CSSProperties = { ...creatorParagraphStyle, margin: 0 };

const SpaceLogo = ({ space }: { space: CustomerEmailSpace }) =>
  space.logoUrl ? (
    <Img
      src={space.logoUrl}
      width={String(LOGO_SIZE)}
      height={String(LOGO_SIZE)}
      alt=""
      style={{ display: "block", borderRadius: "999px", objectFit: "cover" }}
    />
  ) : (
    <div
      style={{
        width: `${LOGO_SIZE}px`,
        height: `${LOGO_SIZE}px`,
        borderRadius: "999px",
        backgroundColor: "#DCEBFF",
        fontFamily: SYSTEM_FONTS,
        fontSize: "16px",
        lineHeight: `${LOGO_SIZE}px`,
        fontWeight: 700,
        textAlign: "center",
        color: CREATOR_EMAIL_COLORS.ink,
      }}
    >
      {getInitials(space.name)}
    </div>
  );

/** « Le bouton ne s'affiche pas ? Ouvrez ce lien : » and the link in clear, after every button. */
export const CustomerFallbackLink = ({ href }: { href: string }) => (
  <Text style={creatorFallbackStyle}>
    Le bouton ne s&apos;affiche pas ? Ouvrez ce lien :{" "}
    <Link href={href} style={creatorLinkStyle}>
      {href}
    </Link>
  </Text>
);

export const CustomerEmailButton = ({ href, label, accentColor }: { href: string; label: string; accentColor: string | null }) => (
  <Button className="customer-email-button" href={href} style={readCustomerButtonStyle(accentColor)}>
    {label}
  </Button>
);

type CustomerEmailLayoutProps = {
  space: CustomerEmailSpace;
  preview: string;
  /** « Vous recevez cet e-mail parce que … » */
  reason: string;
  /** The whole first line, when « Vous recevez cet e-mail parce que » does not open it (the reminder). */
  notice?: string;
  unsubscribeUrl: string;
  children: ReactNode;
};

/** The card with the creator's logo and name, then the footer: the reason, the way out, the sender's address. */
export const CustomerEmailLayout = ({ space, preview, reason, notice, unsubscribeUrl, children }: CustomerEmailLayoutProps) => (
  <Html lang="fr">
    <Head>
      <style>{CUSTOMER_EMAIL_MOBILE_STYLES}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body lang="fr" style={creatorPageStyle}>
      <Container className="customer-email-card" style={creatorCardStyle}>
        <Section style={{ margin: "0 0 32px" }}>
          <Row>
            <Column style={{ width: `${LOGO_SIZE + 16}px`, verticalAlign: "middle" }}>
              <SpaceLogo space={space} />
            </Column>
            <Column style={{ verticalAlign: "middle" }}>
              <Text
                style={{
                  margin: 0,
                  fontFamily: SYSTEM_FONTS,
                  fontSize: "20px",
                  lineHeight: "28px",
                  fontWeight: 700,
                  color: CREATOR_EMAIL_COLORS.ink,
                }}
              >
                {space.name}
              </Text>
            </Column>
          </Row>
        </Section>
        {children}
      </Container>
      <Container className="customer-email-legal" style={creatorLegalStyle}>
        <Text style={creatorLegalLineStyle}>{notice ?? `Vous recevez cet e-⁠mail parce que ${reason}`}</Text>
        <Text style={creatorLegalLineStyle}>
          <Link href={unsubscribeUrl} style={creatorLinkStyle}>
            Ne plus recevoir ces e-⁠mails
          </Link>
        </Text>
        <Text style={creatorLegalLineStyle}>{`Envoyé avec PULSACITY pour ${space.name}`}</Text>
        {space.senderPostalAddress ? (
          <Text style={{ ...creatorLegalLineStyle, margin: 0 }}>{formatPostalAddressLine(space.senderPostalAddress)}</Text>
        ) : null}
      </Container>
    </Body>
  </Html>
);
