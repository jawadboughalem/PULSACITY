import { Text } from "react-email";
import { AccountEmailLayout, CreatorEmailButton } from "./AccountEmailLayout";
import { creatorParagraphStyle, creatorSmallStyle } from "./creator-email-styles";

export const MAGIC_LINK_EMAIL_SUBJECT = "Votre lien pour entrer dans PULSACITY";

type MagicLinkEmailProps = {
  url: string;
  /** The address the link was asked for: the footer says so. */
  email: string;
  lifetimeMinutes: number;
};

/**
 * Maquettes 3.6, « Votre lien »: « Valable 15 minutes » stays, a rule of security rather than a duration of setup. The
 * link in clear reads /entrer/{code} (`shortenSignInLink`).
 */
export const MagicLinkEmail = ({ url, email, lifetimeMinutes }: MagicLinkEmailProps) => (
  <AccountEmailLayout
    preview="Votre lien pour entrer dans votre espace, sans mot de passe."
    notice={`Vous recevez cet e-⁠mail parce qu'une connexion a été demandée avec ${email}.`}
  >
    <Text style={creatorParagraphStyle}>Bonjour,</Text>
    <Text style={{ ...creatorParagraphStyle, marginBottom: "28px" }}>
      {`Voici votre lien pour entrer dans votre espace PULSACITY. Il est valable ${lifetimeMinutes} minutes et ne sert qu'une fois.`}
    </Text>
    <CreatorEmailButton href={url} label="Accéder à mon espace" />
    <Text style={{ ...creatorSmallStyle, margin: 0 }}>
      Vous n&apos;avez pas demandé ce lien ? Ignorez cet e-⁠mail : personne ne peut entrer dans votre espace sans lui.
    </Text>
  </AccountEmailLayout>
);
