import { Text } from "react-email";
import { AccountEmailLayout, CreatorEmailButton } from "./AccountEmailLayout";
import { creatorParagraphStyle } from "./creator-email-styles";

export const NEW_LOGIN_ADDRESS_SUBJECT = "Confirmez votre nouvelle adresse de connexion";

type NewLoginAddressEmailProps = {
  url: string;
  lifetimeHours: number;
};

/**
 * Mon compte, « Changer d'adresse »: sent to the new address. Its link makes it the address of connection; until then,
 * the old one stays. Not drawn: the layout of « Votre lien » (maquettes 3.6).
 */
export const NewLoginAddressEmail = ({ url, lifetimeHours }: NewLoginAddressEmailProps) => (
  <AccountEmailLayout
    preview="Un clic, et cette adresse devient celle de votre espace PULSACITY."
    notice="Vous n'avez rien demandé ? Ignorez cet e-⁠mail : l'adresse de connexion ne changera pas."
  >
    <Text style={creatorParagraphStyle}>Bonjour,</Text>
    <Text style={{ ...creatorParagraphStyle, marginBottom: "28px" }}>
      {`Vous avez demandé que cette adresse devienne celle de votre espace PULSACITY. Nous y enverrons désormais vos liens de connexion. Ce lien est valable ${lifetimeHours} heures et ne sert qu'une fois.`}
    </Text>
    <CreatorEmailButton href={url} label="Confirmer cette adresse" />
  </AccountEmailLayout>
);
