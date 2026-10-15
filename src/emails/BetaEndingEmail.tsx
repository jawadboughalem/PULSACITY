import { Text } from "react-email";
import { describeCard } from "@/lib/billing/describe-card";
import { formatLongDate, formatLongDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { EmailButton } from "./EmailButton";
import { paragraphStyle } from "./email-styles";

export const describeBetaEndingSubject = (firstPaymentAt: Date): string =>
  `Votre plan Essentiel devient payant le ${formatLongDayMonth(firstPaymentAt)}`;

type BetaEndingEmailProps = {
  firstPaymentAt: Date;
  amountCents: number;
  /** « Visa se terminant par 4242 », when Stripe knows the card. */
  card: { brand: string; last4: string } | null;
  billingUrl: string;
};

/**
 * Promised on « Abonnement et factures » (maquette 8.3, bêta-testeur): 7 days before the first payment of a beta
 * tester, what will be taken, when, and how to stop before. Sent once.
 */
export const BetaEndingEmail = ({ firstPaymentAt, amountCents, card, billingUrl }: BetaEndingEmailProps) => {
  const price = formatPrice(amountCents, "EUR");
  const day = formatLongDate(firstPaymentAt);
  return (
    <AccountEmailLayout
      preview={`Le ${formatLongDayMonth(firstPaymentAt)}, premier prélèvement de ${price}, au prix de lancement gardé à vie.`}
      legalNotice="Vous recevez cet e-mail parce que vous testez PULSACITY avec le plan Essentiel offert."
    >
      <Text style={paragraphStyle}>Bonjour,</Text>
      <Text style={paragraphStyle}>{`Merci de tester PULSACITY. Votre plan Essentiel offert se termine le ${day}.`}</Text>
      <Text style={paragraphStyle}>
        {`Ce jour-là, nous prélevons ${price}${card !== null ? ` sur votre ${describeCard(card)}` : ""}, puis ${price} chaque mois : c'est le prix de lancement, gardé à vie tant que votre abonnement continue.`}
      </Text>
      <Text style={paragraphStyle}>
        {`Pour continuer, vous n'avez rien à faire. Pour arrêter, passez au plan Gratuit avant le ${day} : rien ne sera prélevé, et rien n'est supprimé.`}
      </Text>
      <EmailButton href={billingUrl} label="Voir mon abonnement" />
    </AccountEmailLayout>
  );
};
