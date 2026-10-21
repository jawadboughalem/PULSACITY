import { Section, Text } from "react-email";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { creatorParagraphStyle, creatorQuoteBoxStyle, creatorSmallStyle } from "./creator-email-styles";

/** The space of the sender, when they wrote while signed in: what the answer often needs to know. */
export type ContactSenderSpace = {
  name: string;
  planName: string;
};

type ContactMessageEmailProps = {
  email: string;
  subject: string;
  message: string;
  space: ContactSenderSpace | null;
};

const labelStyle = { ...creatorSmallStyle, margin: "0 0 4px", fontWeight: 700 };

/**
 * « Écrivez-nous » (/aide), to contact@pulsacity.com: who wrote, from which space, and the message as typed. « Répondre »
 * writes to the sender. Nothing of it is kept anywhere else. Read by the founder only: not drawn, the v2 layout.
 */
export const ContactMessageEmail = ({ email, subject, message, space }: ContactMessageEmailProps) => (
  <AccountEmailLayout
    preview={message.slice(0, 90)}
    notice="Envoyé depuis le formulaire « Écrivez-nous » de pulsacity.com/aide. Ce message n'est gardé nulle part ailleurs."
  >
    <Text style={labelStyle}>De</Text>
    <Text style={creatorParagraphStyle}>{`${email}. Répondez à cet e-⁠mail : la réponse lui arrive directement.`}</Text>
    <Text style={labelStyle}>Espace</Text>
    <Text style={creatorParagraphStyle}>
      {space ? `${space.name}, plan ${space.planName}. Écrit en étant connecté.` : "Écrit sans être connecté à un espace."}
    </Text>
    <Text style={labelStyle}>Sujet</Text>
    <Text style={creatorParagraphStyle}>{subject}</Text>
    <Section style={{ ...creatorQuoteBoxStyle, margin: "8px 0 0" }}>
      {message.split("\n").map((line, index) => (
        <Text key={index} style={{ ...creatorParagraphStyle, margin: 0, minHeight: "24px" }}>
          {line}
        </Text>
      ))}
    </Section>
  </AccountEmailLayout>
);
