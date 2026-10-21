import { Fragment } from "react";
import { Link, Section, Text } from "react-email";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { getAppUrl } from "@/lib/app-url";
import { PASTE_GUIDE_STEPS, PASTE_GUIDE_SUMMARY } from "@/lib/widgets/paste-guide-steps";
import { AccountEmailLayout } from "./AccountEmailLayout";
import {
  CREATOR_EMAIL_COLORS,
  creatorLinkStyle,
  creatorParagraphStyle,
  creatorQuoteBoxStyle,
  creatorSmallStyle,
  creatorTitleStyle,
} from "./creator-email-styles";

export const WIDGET_CODE_EMAIL_SUBJECT = "Le code de votre widget PULSACITY";

type WidgetCodeEmailProps = {
  snippet: string;
};

/**
 * Maquettes 3.6, « Code du widget »: the code on Nuage, then the four steps of Systeme.io, without a duration. Systeme.io
 * is one tool among others: the guides of the other pages follow.
 */
export const WidgetCodeEmail = ({ snippet }: WidgetCodeEmailProps) => (
  <AccountEmailLayout
    preview="Le code à coller une fois sur votre page de vente."
    notice="Vous recevez cet e-⁠mail parce que vous l'avez demandé depuis votre espace PULSACITY."
  >
    <Text style={creatorParagraphStyle}>Bonjour,</Text>
    <Text style={{ ...creatorParagraphStyle, marginBottom: "24px" }}>
      Voici le code de votre widget. Collez-le une seule fois sur votre page de vente : vos réglages s&apos;appliquent
      ensuite tout seuls.
    </Text>
    <Section style={{ ...creatorQuoteBoxStyle, padding: "16px" }}>
      <Text
        style={{
          margin: 0,
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "14px",
          lineHeight: "20px",
          color: CREATOR_EMAIL_COLORS.ink,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {snippet}
      </Text>
    </Section>
    <Text style={creatorTitleStyle}>{`Coller dans Systeme.io, en ${PASTE_GUIDE_SUMMARY}`}</Text>
    <ol style={{ margin: "0 0 20px", paddingLeft: "22px" }}>
      {PASTE_GUIDE_STEPS.map((parts, index) => (
        <li key={index} style={{ ...creatorParagraphStyle, margin: "0 0 12px" }}>
          {parts.map((part, partIndex) =>
            typeof part === "string" ? (
              <Fragment key={partIndex}>{part}</Fragment>
            ) : (
              <strong key={partIndex}>{part.strong}</strong>
            ),
          )}
        </li>
      ))}
    </ol>
    <Text style={{ ...creatorSmallStyle, margin: 0 }}>
      Votre page est sur WordPress, Wix ou un autre outil ?{" "}
      <Link href={`${getAppUrl()}${MARKETING_PATHS.guides}`} style={creatorLinkStyle}>
        Voir les guides
      </Link>
    </Text>
  </AccountEmailLayout>
);
