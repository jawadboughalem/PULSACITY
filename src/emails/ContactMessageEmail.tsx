import { Section, Text } from "react-email";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { EMAIL_COLORS, paragraphStyle, smallStyle } from "./email-styles";

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

const labelStyle = { ...smallStyle, margin: "0 0 4px" };

/**
 * « Écrivez-nous » (/aide), to contact@pulsacity.com: who wrote, from which space, and the message as typed. « Répondre »
 * writes to the sender. Nothing of it is kept anywhere else.
 */
export const ContactMessageEmail = ({ email, subject, message, space }: ContactMessageEmailProps) => (
  <AccountEmailLayout
    preview={message.slice(0, 90)}
    legalNotice="Envoyé depuis le formulaire « Écrivez-nous » de pulsacity.com/aide. Ce message n'est gardé nulle part ailleurs."
  >
    <Text style={labelStyle}>De</Text>
    <Text style={paragraphStyle}>{`${email}. Répondez à cet e-mail : la réponse lui arrive directement.`}</Text>
    <Text style={labelStyle}>Espace</Text>
    <Text style={paragraphStyle}>
      {space ? `${space.name}, plan ${space.planName}. Écrit en étant connecté.` : "Écrit sans être connecté à un espace."}
    </Text>
    <Text style={labelStyle}>Sujet</Text>
    <Text style={paragraphStyle}>{subject}</Text>
    <Section style={{ margin: "8px 0 0", padding: "24px", border: `1px solid ${EMAIL_COLORS.hairline200}` }}>
      {message.split("\n").map((line, index) => (
        <Text key={index} style={{ ...paragraphStyle, margin: 0, minHeight: "24px" }}>
          {line}
        </Text>
      ))}
    </Section>
  </AccountEmailLayout>
);
