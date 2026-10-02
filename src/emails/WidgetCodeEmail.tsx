import { Fragment } from "react";
import { Section, Text } from "react-email";
import { PASTE_GUIDE_DURATION, PASTE_GUIDE_STEPS } from "@/lib/widgets/paste-guide-steps";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { EMAIL_COLORS, paragraphStyle, smallStyle } from "./email-styles";

export const WIDGET_CODE_EMAIL_SUBJECT = "Le code de votre widget PULSACITY";

type WidgetCodeEmailProps = {
  snippet: string;
};

export const WidgetCodeEmail = ({ snippet }: WidgetCodeEmailProps) => (
  <AccountEmailLayout
    preview="Le code à coller une fois sur votre page de vente."
    legalNotice="Vous recevez cet e-mail parce que vous l'avez demandé depuis votre espace PULSACITY."
  >
    <Text style={paragraphStyle}>Bonjour,</Text>
    <Text style={paragraphStyle}>
      Voici le code de votre widget. Collez-le une seule fois dans un bloc HTML de votre page de vente Systeme.io.
    </Text>
    <Section style={{ margin: "0 0 24px", padding: "16px", backgroundColor: EMAIL_COLORS.paper100 }}>
      <Text
        style={{
          ...smallStyle,
          color: EMAIL_COLORS.ink900,
          fontFamily: "'Courier New', Courier, monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {snippet}
      </Text>
    </Section>
    <Text style={{ ...paragraphStyle, fontWeight: 600 }}>{`Coller dans Systeme.io : ${PASTE_GUIDE_DURATION}`}</Text>
    {PASTE_GUIDE_STEPS.map((parts, index) => (
      <Text key={index} style={paragraphStyle}>
        {`${index + 1}. `}
        {parts.map((part, partIndex) =>
          typeof part === "string" ? (
            <Fragment key={partIndex}>{part}</Fragment>
          ) : (
            <strong key={partIndex}>{part.strong}</strong>
          ),
        )}
      </Text>
    ))}
  </AccountEmailLayout>
);
