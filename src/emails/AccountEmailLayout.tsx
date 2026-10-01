import type { ReactNode } from "react";
import { Body, Column, Container, Head, Html, Img, Preview, Row, Section, Text } from "react-email";
import { getAppUrl } from "@/lib/app-url";
import {
  EMAIL_MOBILE_STYLES,
  cardStyle,
  headerNameStyle,
  headerStyle,
  headerSymbolCellStyle,
  headerSymbolStyle,
  legalStyle,
  pageStyle,
} from "./email-styles";

export const EMAIL_SYMBOL_PATH = "/brand/email-symbole-48.png";

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
        <Section style={headerStyle}>
          <Row>
            <Column style={headerSymbolCellStyle}>
              <Img src={`${getAppUrl()}${EMAIL_SYMBOL_PATH}`} width="24" height="24" alt="" style={headerSymbolStyle} />
            </Column>
            <Column>
              <Text style={headerNameStyle}>Pulsacity</Text>
            </Column>
          </Row>
        </Section>
        {children}
      </Container>
      <Container className="email-legal" style={legalStyle}>
        {legalNotice}
      </Container>
    </Body>
  </Html>
);
