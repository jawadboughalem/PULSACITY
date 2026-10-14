import { Text } from "react-email";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { EmailButton } from "./EmailButton";
import { paragraphStyle } from "./email-styles";

export const NEW_LOGIN_ADDRESS_SUBJECT = "Confirmez votre nouvelle adresse de connexion";

type NewLoginAddressEmailProps = {
  url: string;
  lifetimeHours: number;
};

/**
 * Mon compte, « Changer d'adresse »: sent to the new address. Its link makes it the address of connection; until then,
 * the old one stays.
 */
export const NewLoginAddressEmail = ({ url, lifetimeHours }: NewLoginAddressEmailProps) => (
  <AccountEmailLayout
    preview="Un clic, et cette adresse devient celle de votre espace PULSACITY."
    legalNotice="Vous n'avez rien demandé ? Ignorez cet e-mail : l'adresse de connexion ne changera pas."
  >
    <Text style={paragraphStyle}>Bonjour,</Text>
    <Text style={paragraphStyle}>
      Vous avez demandé que cette adresse devienne celle de votre espace PULSACITY. Nous y enverrons désormais vos liens
      de connexion.
    </Text>
    <EmailButton href={url} label="Confirmer cette adresse" />
    <Text style={paragraphStyle}>{`Ce lien est valable ${lifetimeHours} heures. Il ne sert qu'une fois.`}</Text>
  </AccountEmailLayout>
);
