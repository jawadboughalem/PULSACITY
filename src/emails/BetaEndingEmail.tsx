import { Section, Text } from "react-email";
import { describeCard } from "@/lib/billing/describe-card";
import { formatLongDate, formatLongDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { AccountEmailLayout, CreatorEmailButton } from "./AccountEmailLayout";
import { creatorParagraphStyle, creatorQuoteBoxStyle, creatorSmallStyle } from "./creator-email-styles";

export const describeBetaEndingSubject = (firstPaymentAt: Date): string =>
  `Votre plan Essentiel offert se termine le ${formatLongDayMonth(firstPaymentAt)}`;

type BetaEndingEmailProps = {
  firstPaymentAt: Date;
  amountCents: number;
  /** « Visa se terminant par 4242 », when Stripe knows the card. */
  card: { brand: string; last4: string } | null;
  billingUrl: string;
};

/**
 * Maquettes 3.6, « Rappel 7 jours avant le premier prélèvement » (tarifs.md): the date, the amount at the launch price
 * kept for life, and how to change or stop, without fees. Its texts are Design's proposal. Sent once.
 */
export const BetaEndingEmail = ({ firstPaymentAt, amountCents, card, billingUrl }: BetaEndingEmailProps) => {
  const price = formatPrice(amountCents, "EUR");
  const day = formatLongDate(firstPaymentAt);
  return (
    <AccountEmailLayout
      preview={`Premier prélèvement le ${formatLongDayMonth(firstPaymentAt)}${NO_BREAK_SPACE}: ${price} par mois, prix de lancement gardé à vie.`}
      notice={`Vous recevez cet e-⁠mail parce que votre plan Essentiel offert pendant la bêta se termine le ${day}.`}
    >
      <Text style={creatorParagraphStyle}>Bonjour,</Text>
      <Text style={creatorParagraphStyle}>Merci d&apos;avoir testé PULSACITY pendant la bêta.</Text>
      <Text style={{ ...creatorParagraphStyle, marginBottom: "24px" }}>
        {`Votre plan Essentiel offert se termine le ${day}. Le premier prélèvement aura lieu ce jour-là, ${card ? `sur votre ${describeCard(card)}` : "sur la carte enregistrée dans votre espace"}.`}
      </Text>
      <Section style={{ ...creatorQuoteBoxStyle, margin: "0 0 24px", padding: "20px 20px" }}>
        <Text style={{ ...creatorSmallStyle, margin: "0 0 4px", fontWeight: 700 }}>{`À partir du ${day}`}</Text>
        <Text style={{ ...creatorParagraphStyle, margin: "0 0 8px", fontSize: "18px", lineHeight: "26px", fontWeight: 700 }}>
          {`Essentiel, mensuel · ${price} par mois`}
        </Text>
        <Text style={{ ...creatorParagraphStyle, margin: 0, fontSize: "15px", lineHeight: "22px" }}>
          Prix de lancement, gardé à vie tant que votre abonnement ne s&apos;interrompt pas. Vous payez le prix affiché.
        </Text>
      </Section>
      <Text style={{ ...creatorParagraphStyle, marginBottom: "28px" }}>
        Rien à faire pour continuer. Pour changer de formule ou résilier avant cette date, c&apos;est dans votre espace, sans
        frais.
      </Text>
      <CreatorEmailButton href={billingUrl} label="Gérer mon abonnement" />
    </AccountEmailLayout>
  );
};
