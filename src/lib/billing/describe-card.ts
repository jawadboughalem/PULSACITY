import { NO_BREAK_SPACE } from "@/lib/french/typography";

const CARD_BRANDS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  cartes_bancaires: "Carte Bancaire",
};

/** « Visa se terminant par 4242 »: the card Stripe keeps, never more than its brand and last four digits. */
export const describeCard = ({ brand, last4 }: { brand: string; last4: string }): string =>
  `${CARD_BRANDS[brand] ?? "Carte"} se terminant par${NO_BREAK_SPACE}${last4}`;
