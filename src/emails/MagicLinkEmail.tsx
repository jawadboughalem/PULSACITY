import { Text } from "react-email";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { EmailButton } from "./EmailButton";
import { paragraphStyle } from "./email-styles";

export const MAGIC_LINK_EMAIL_SUBJECT = "Votre lien pour entrer dans PULSACITY";

type MagicLinkEmailProps = {
  url: string;
  lifetimeMinutes: number;
};

export const MagicLinkEmail = ({ url, lifetimeMinutes }: MagicLinkEmailProps) => (
  <AccountEmailLayout
    preview="Votre lien pour entrer dans votre espace, sans mot de passe."
    legalNotice="Vous n'avez rien demandé ? Ignorez cet e-mail. Sans ce lien, personne ne peut entrer dans votre espace."
  >
    <Text style={paragraphStyle}>Bonjour,</Text>
    <Text style={paragraphStyle}>Voici votre lien pour entrer dans votre espace PULSACITY.</Text>
    <EmailButton href={url} label="Accéder à mon espace" />
    <Text style={paragraphStyle}>{`Ce lien est valable ${lifetimeMinutes} minutes. Il ne sert qu'une fois.`}</Text>
  </AccountEmailLayout>
);
