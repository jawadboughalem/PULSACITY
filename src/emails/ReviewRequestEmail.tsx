import { Body, Column, Container, Head, Html, Img, Link, Preview, Row, Section, Text } from "react-email";
import type { PurchaseEventType } from "@/lib/connectors/types";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { getInitials } from "@/lib/spaces/get-initials";
import { EmailButton } from "./EmailButton";
import {
  EMAIL_COLORS,
  EMAIL_MOBILE_STYLES,
  cardStyle,
  headerStyle,
  legalStyle,
  linkStyle,
  pageStyle,
  paragraphStyle,
} from "./email-styles";

export type ReviewEmailKind = "request" | "reminder";

export const REVIEW_BUTTON_LABEL = "Donner mon avis (1 minute)";

type ReviewRequestEmailProps = {
  kind: ReviewEmailKind;
  spaceName: string;
  logoUrl: string | null;
  firstName: string | null;
  productName: string;
  eventType: PurchaseEventType | null;
  purchasedAt: Date;
  reviewUrl: string;
  unsubscribeUrl: string;
};

const AVATAR_SIZE = 44;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

/** « Camille, votre avis sur Programme 30 jours ? », the question mark held to its word. */
export const buildReviewEmailSubject = (kind: ReviewEmailKind, firstName: string | null, productName: string): string => {
  const question = kind === "request" ? `votre avis sur ${productName}` : `une minute pour ${productName}`;
  const sentence = firstName ? `${firstName}, ${question}` : question.charAt(0).toUpperCase() + question.slice(1);
  return `${sentence}${NO_BREAK_SPACE}?`;
};

const buildReason = (spaceName: string, productName: string, eventType: PurchaseEventType | null, purchasedAt: Date) =>
  eventType === "enrollment"
    ? `vous avez rejoint ${productName} auprès de ${spaceName} le ${formatDayMonthYear(purchasedAt)}.`
    : `vous avez acheté ${productName} auprès de ${spaceName} le ${formatDayMonthYear(purchasedAt)}.`;

const SpaceAvatar = ({ spaceName, logoUrl }: { spaceName: string; logoUrl: string | null }) =>
  logoUrl ? (
    <Img
      src={logoUrl}
      width={String(AVATAR_SIZE)}
      height={String(AVATAR_SIZE)}
      alt=""
      style={{ display: "block", borderRadius: "999px", objectFit: "cover" }}
    />
  ) : (
    <div
      style={{
        width: `${AVATAR_SIZE}px`,
        height: `${AVATAR_SIZE}px`,
        borderRadius: "999px",
        backgroundColor: EMAIL_COLORS.paper100,
        border: `1px solid ${EMAIL_COLORS.hairline200}`,
        boxSizing: "border-box",
        fontFamily: SERIF,
        fontSize: "16px",
        lineHeight: `${AVATAR_SIZE - 2}px`,
        fontWeight: 700,
        textAlign: "center",
        color: EMAIL_COLORS.ink900,
      }}
    >
      {getInitials(spaceName)}
    </div>
  );

/** Maquette 3: the request, then the one reminder four days later, in the creator's name. */
export const ReviewRequestEmail = ({
  kind,
  spaceName,
  logoUrl,
  firstName,
  productName,
  eventType,
  purchasedAt,
  reviewUrl,
  unsubscribeUrl,
}: ReviewRequestEmailProps) => {
  const reason = buildReason(spaceName, productName, eventType, purchasedAt);
  const preview =
    kind === "request"
      ? `Merci d'avoir suivi ${productName}. Une note et quelques mots suffisent.`
      : "Sans insister : votre avis m'aiderait beaucoup. C'est mon dernier message à ce sujet.";

  return (
    <Html lang="fr">
      <Head>
        <style>{EMAIL_MOBILE_STYLES}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body lang="fr" style={pageStyle}>
        <Container className="email-card" style={cardStyle}>
          <Section style={headerStyle}>
            <Row>
              <Column style={{ width: `${AVATAR_SIZE + 16}px`, verticalAlign: "middle" }}>
                <SpaceAvatar spaceName={spaceName} logoUrl={logoUrl} />
              </Column>
              <Column style={{ verticalAlign: "middle" }}>
                <Text style={{ margin: 0, fontFamily: SANS, fontSize: "20px", lineHeight: "28px", fontWeight: 700 }}>
                  {spaceName}
                </Text>
              </Column>
            </Row>
          </Section>
          <Text style={paragraphStyle}>{firstName ? `Bonjour ${firstName},` : "Bonjour,"}</Text>
          {kind === "request" ? (
            <>
              <Text style={paragraphStyle}>{`Merci d'avoir suivi ${productName}.`}</Text>
              <Text style={paragraphStyle}>
                Votre avis compte beaucoup pour moi : il m&apos;aide à progresser, et il aide d&apos;autres personnes à se
                lancer.
              </Text>
              <Text style={{ ...paragraphStyle, marginBottom: "24px" }}>Une note et quelques mots suffisent.</Text>
            </>
          ) : (
            <Text style={{ ...paragraphStyle, marginBottom: "24px" }}>
              {`Je reviens vers vous une seule fois, sans insister. Si vous avez une minute, votre avis sur ${productName} m'aiderait beaucoup.`}
            </Text>
          )}
          <EmailButton href={reviewUrl} label={REVIEW_BUTTON_LABEL} />
          <Text style={{ ...paragraphStyle, margin: "8px 0 4px" }}>
            {kind === "request" ? "Merci d'avance," : "Belle journée,"}
          </Text>
          <Text style={{ ...paragraphStyle, margin: 0, fontSize: "20px", lineHeight: "28px", fontWeight: 700 }}>
            {spaceName}
          </Text>
        </Container>
        <Container className="email-legal" style={legalStyle}>
          <Text style={{ margin: "0 0 12px", font: "inherit", color: "inherit" }}>
            {kind === "request"
              ? `Vous recevez cet e-mail parce que ${reason}`
              : `C'est le dernier message à ce sujet. Vous le recevez parce que ${reason}`}
          </Text>
          <Text style={{ margin: "0 0 12px", font: "inherit" }}>
            <Link href={unsubscribeUrl} style={{ ...linkStyle, textDecoration: "underline" }}>
              Ne plus recevoir ces e-mails
            </Link>
          </Text>
          <Text style={{ margin: 0, font: "inherit", color: "inherit" }}>{`Envoyé avec PULSACITY pour ${spaceName}`}</Text>
        </Container>
      </Body>
    </Html>
  );
};
