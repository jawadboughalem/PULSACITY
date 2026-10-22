import { Section, Text } from "react-email";
import { PLANS, type PlanId, type PriceList } from "@/config/plans";
import { describeCard } from "@/lib/billing/describe-card";
import { formatLongDate, formatLongDayMonth } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { AccountEmailLayout, CreatorEmailButton } from "./AccountEmailLayout";
import { creatorParagraphStyle, creatorQuoteBoxStyle, creatorSmallStyle } from "./creator-email-styles";

export const describeAnnualRenewalSubject = (renewalAt: Date): string =>
  `Votre abonnement annuel se renouvelle le ${formatLongDayMonth(renewalAt)}`;

type AnnualRenewalEmailProps = {
  renewalAt: Date;
  plan: PlanId;
  priceList: PriceList;
  amountCents: number;
  /** « Visa se terminant par 4242 », when Stripe knows the card. */
  card: { brand: string; last4: string } | null;
  billingUrl: string;
};

/**
 * CGV 5.2: 7 days before a yearly renewal, the date, the plan and its price, and how to change or stop before, without
 * fees. Built on the beta testers' reminder (maquettes 3.6), with its components and its words. Sent once a renewal.
 */
export const AnnualRenewalEmail = ({ renewalAt, plan, priceList, amountCents, card, billingUrl }: AnnualRenewalEmailProps) => {
  const price = formatPrice(amountCents, "EUR");
  const day = formatLongDate(renewalAt);
  const planName = PLANS[plan].name;
  return (
    <AccountEmailLayout
      preview={`Renouvellement le ${formatLongDayMonth(renewalAt)}${NO_BREAK_SPACE}: ${planName}, ${price} par an.`}
      notice={`Vous recevez cet e-⁠mail parce que votre abonnement annuel se renouvelle le ${day}.`}
    >
      <Text style={creatorParagraphStyle}>Bonjour,</Text>
      <Text style={{ ...creatorParagraphStyle, marginBottom: "24px" }}>
        {`Votre abonnement ${planName} annuel se renouvelle le ${day}. Le paiement aura lieu ce jour-là, ${card ? `sur votre ${describeCard(card)}` : "sur la carte enregistrée dans votre espace"}.`}
      </Text>
      <Section style={{ ...creatorQuoteBoxStyle, margin: "0 0 24px", padding: "20px 20px" }}>
        <Text style={{ ...creatorSmallStyle, margin: "0 0 4px", fontWeight: 700 }}>{`À partir du ${day}`}</Text>
        <Text style={{ ...creatorParagraphStyle, margin: "0 0 8px", fontSize: "18px", lineHeight: "26px", fontWeight: 700 }}>
          {`${planName}, annuel · ${price} par an`}
        </Text>
        <Text style={{ ...creatorParagraphStyle, margin: 0, fontSize: "15px", lineHeight: "22px" }}>
          {priceList === "founder"
            ? "Prix de lancement, gardé à vie tant que votre abonnement ne s'interrompt pas. Vous payez le prix affiché."
            : "Vous payez le prix affiché."}
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
