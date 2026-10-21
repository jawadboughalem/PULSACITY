import type { ReactNode } from "react";
import { Body, Button, Column, Container, Head, Html, Img, Link, Preview, Row, Section, Text } from "react-email";
import { getAppUrl } from "@/lib/app-url";
import { formatPublisherPostalLine } from "@/lib/legal/publisher";
import {
  CREATOR_EMAIL_MOBILE_STYLES,
  creatorButtonStyle,
  creatorCardStyle,
  creatorFallbackStyle,
  creatorHeaderStyle,
  creatorLegalLineStyle,
  creatorLegalStyle,
  creatorLinkStyle,
  creatorNameStyle,
  creatorPageStyle,
  creatorSymbolCellStyle,
  creatorSymbolStyle,
} from "./creator-email-styles";

export const EMAIL_SYMBOL_PATH = "/brand/email-symbole-48.png";

export const PULSACITY_SIGNATURE = "PULSACITY";

/**
 * The sender, last of the footer (maquettes 3.6, « adresse postale de PULSACITY »): « PULSACITY », then the person who
 * sends as a private seller and their address, from the variables of the legal texts (lot 4.9); without them, the name
 * alone.
 */
export const PulsacitySender = ({ isLast = true }: { isLast?: boolean }) => {
  const postalLine = formatPublisherPostalLine();
  const lastStyle = isLast ? { ...creatorLegalLineStyle, margin: 0 } : creatorLegalLineStyle;
  return (
    <>
      <Text style={postalLine ? creatorLegalLineStyle : lastStyle}>{PULSACITY_SIGNATURE}</Text>
      {postalLine ? <Text style={lastStyle}>{postalLine}</Text> : null}
    </>
  );
};

/** Charte v2, « E-mails », e-mails to the creator: `email-symbole-48.png` shown at 24, then « PULSACITY » in text. */
export const CreatorEmailHeader = ({ appUrl = getAppUrl() }: { appUrl?: string }) => (
  <Section style={creatorHeaderStyle}>
    <Row>
      <Column style={creatorSymbolCellStyle}>
        <Img src={`${appUrl}${EMAIL_SYMBOL_PATH}`} width="24" height="24" alt="" style={creatorSymbolStyle} />
      </Column>
      <Column>
        <Text style={creatorNameStyle}>PULSACITY</Text>
      </Column>
    </Row>
  </Section>
);

/** Soleil, Encre text; always followed by « Le bouton ne s'affiche pas ? Ouvrez ce lien : » and the link in clear. */
export const CreatorEmailButton = ({ href, label }: { href: string; label: string }) => (
  <>
    <Button className="creator-email-button" href={href} style={creatorButtonStyle}>
      {label}
    </Button>
    <Text style={creatorFallbackStyle}>
      Le bouton ne s&apos;affiche pas ? Ouvrez ce lien :{" "}
      <Link href={href} style={creatorLinkStyle}>
        {href}
      </Link>
    </Text>
  </>
);

type AccountEmailLayoutProps = {
  preview: string;
  /** Why this e-mail came, first line of the footer: « Vous recevez cet e-mail parce que … ». */
  notice: ReactNode;
  children: ReactNode;
};

/**
 * Maquettes 3.6, « Créateur · E-mails »: the e-mails PULSACITY sends a creator. A white card of 600 on Nuage, radius 20
 * (square under Outlook), padding 40 (24 on a phone); system fonts only. Below, the reason, then the sender.
 */
export const AccountEmailLayout = ({ preview, notice, children }: AccountEmailLayoutProps) => (
  <Html lang="fr">
    <Head>
      <style>{CREATOR_EMAIL_MOBILE_STYLES}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body lang="fr" style={creatorPageStyle}>
      <Container className="creator-email-card" style={creatorCardStyle}>
        <CreatorEmailHeader />
        {children}
      </Container>
      <Container className="creator-email-legal" style={creatorLegalStyle}>
        <Text style={creatorLegalLineStyle}>{notice}</Text>
        <PulsacitySender />
      </Container>
    </Body>
  </Html>
);
