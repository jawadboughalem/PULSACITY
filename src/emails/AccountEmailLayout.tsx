import type { ReactNode } from "react";
import { Body, Container, Head, Html, Preview, Text } from "react-email";
import { EMAIL_MOBILE_STYLES, cardStyle, headerStyle, legalStyle, pageStyle } from "./email-styles";

type AccountEmailLayoutProps = {
  preview: string;
  legalNotice: string;
  children: ReactNode;
};

export const AccountEmailLayout = ({ preview, legalNotice, children }: AccountEmailLayoutProps) => (
  <Html lang="fr">
    <Head>
      <style>{EMAIL_MOBILE_STYLES}</style>
    </Head>
    <Preview>{preview}</Preview>
    <Body lang="fr" style={pageStyle}>
      <Container className="email-card" style={cardStyle}>
        <Text style={headerStyle}>PULSACITY</Text>
        {children}
      </Container>
      <Container className="email-legal" style={legalStyle}>
        {legalNotice}
      </Container>
    </Body>
  </Html>
);
