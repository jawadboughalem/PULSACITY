import { Link, Section, Text } from "react-email";
import type { PriceList } from "@/config/plans";
import { describeLaunchPrice, readPlanPrice } from "@/content/plan-offer";
import { BILLING_HREF, TESTIMONIALS_SECTION_HREF } from "@/components/space/space-sections";
import { readConnectorName } from "@/lib/connectors/registry";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { formatPrice } from "@/lib/french/format-price";
import { prefixPersonWithDe } from "@/lib/french/prefix-with-de";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { getFirstName } from "@/lib/testimonials/format-customer-name";
import type { TestimonialProvenance } from "@/lib/testimonials/testimonial-provenance";
import { AccountEmailLayout, CreatorEmailButton } from "./AccountEmailLayout";
import {
  CREATOR_EMAIL_COLORS,
  creatorLinkStyle,
  creatorParagraphStyle,
  creatorQuoteBoxStyle,
  creatorSmallStyle,
  creatorWaitingBoxStyle,
} from "./creator-email-styles";

const MAX_RATING = 5;

/** Réglages, « Vos notifications » (3.3): the switch of this e-mail. */
const NOTIFICATIONS_HREF = "/app/reglages#settings-notifications";

export const buildNewTestimonialSubject = (authorFirstName: string, rating: number) =>
  `Nouveau témoignage ${prefixPersonWithDe(authorFirstName)} (${rating}/${MAX_RATING})`;

type NewTestimonialEmailProps = {
  spaceName: string;
  productName: string | null;
  authorName: string;
  authorTitle: string | null;
  rating: number;
  body: string;
  provenance: TestimonialProvenance;
  purchasedAt: Date | null;
  /** The tool the sale came from, for « Vente reçue de Systeme.io ». */
  purchaseConnector: string | null;
  appUrl: string;
  planName: string;
  planTestimonialLimit: number | null;
  isOverPlanLimit: boolean;
  /** The prices the site shows today: the founder price until the hundredth seat. */
  priceList: PriceList;
};

/** Positionnement.md, point 1: where the testimonial comes from, as the fiche says it (maquettes 3.4, « Provenance »). */
export const describeNewTestimonialSource = ({
  provenance,
  purchasedAt,
  purchaseConnector,
}: Pick<NewTestimonialEmailProps, "provenance" | "purchasedAt" | "purchaseConnector">): string => {
  const purchase = purchasedAt ? `achat du ${formatDayMonthYear(purchasedAt)}` : "date d'achat inconnue";
  if (provenance === "sale") {
    return `${purchaseConnector ? `Vente reçue de ${readConnectorName(purchaseConnector)}` : "Vente reçue"} · ${purchase}`;
  }
  if (provenance === "request") return `Demande manuelle · ${purchase}`;
  return "Laissé depuis votre lien de collecte · date d'achat inconnue";
};

const quoted = (text: string) => `«${NO_BREAK_SPACE}${text.trim()}${NO_BREAK_SPACE}»`;

/** Stars in characters, Encre and Gris, always followed by « 4 sur 5 » in text (charte v2, « E-mails »). */
const Rating = ({ rating }: { rating: number }) => (
  <Text style={{ ...creatorParagraphStyle, margin: "0 0 12px", fontWeight: 700 }}>
    <span style={{ color: CREATOR_EMAIL_COLORS.ink, letterSpacing: "2px" }}>{"★".repeat(rating)}</span>
    <span style={{ color: CREATOR_EMAIL_COLORS.gray, letterSpacing: "2px" }}>{"☆".repeat(MAX_RATING - rating)}</span>
    {` ${rating} sur ${MAX_RATING}`}
  </Text>
);

/**
 * Maquettes 3.6, « Nouveau témoignage »: the testimonial whole, its provenance and its status; when the free plan is
 * full, what Essentiel would change, at the price the site shows. The button leads to the testimonials, where one
 * validates.
 */
export const NewTestimonialEmail = ({
  spaceName,
  productName,
  authorName,
  authorTitle,
  rating,
  body,
  provenance,
  purchasedAt,
  purchaseConnector,
  appUrl,
  planName,
  planTestimonialLimit,
  isOverPlanLimit,
  priceList,
}: NewTestimonialEmailProps) => {
  const essentielPrice = formatPrice(readPlanPrice("essentiel", "monthly", priceList), "EUR");
  const launchPrice = describeLaunchPrice("essentiel", "monthly", priceList);
  return (
    <AccountEmailLayout
      preview={`${rating} sur ${MAX_RATING}${NO_BREAK_SPACE}: ${quoted(body.length > 90 ? `${body.slice(0, 90)} …` : body)}`}
      notice={
        <>
          Vous recevez cet e-⁠mail à chaque nouveau témoignage.{" "}
          <Link href={`${appUrl}${NOTIFICATIONS_HREF}`} style={creatorLinkStyle}>
            Régler les notifications
          </Link>
        </>
      }
    >
      <Text style={creatorParagraphStyle}>Bonjour,</Text>
      <Text style={{ ...creatorParagraphStyle, marginBottom: "24px" }}>
        {productName
          ? `Un nouveau témoignage sur ${productName} vient d'arriver dans votre espace ${spaceName}.`
          : `Un nouveau témoignage vient d'arriver dans votre espace ${spaceName}.`}
      </Text>
      <Section style={creatorQuoteBoxStyle}>
        <Rating rating={rating} />
        <Text style={{ ...creatorParagraphStyle, margin: "0 0 16px", fontSize: "18px", lineHeight: "26px" }}>
          {quoted(body)}
        </Text>
        <Text style={{ ...creatorSmallStyle, margin: "0 0 4px", fontWeight: 700, color: CREATOR_EMAIL_COLORS.ink }}>
          {authorTitle ? `${authorName} · ${authorTitle}` : authorName}
        </Text>
        <Text style={{ ...creatorSmallStyle, margin: "0 0 16px" }}>
          {describeNewTestimonialSource({ provenance, purchasedAt, purchaseConnector })}
        </Text>
        <Text
          style={{
            display: "inline-block",
            margin: 0,
            padding: "4px 12px",
            borderRadius: "9999px",
            backgroundColor: CREATOR_EMAIL_COLORS.waitingSurface,
            color: CREATOR_EMAIL_COLORS.waiting,
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 700,
          }}
        >
          En attente de votre validation
        </Text>
      </Section>
      {isOverPlanLimit && planTestimonialLimit !== null ? (
        <Section style={creatorWaitingBoxStyle}>
          <Text style={{ ...creatorParagraphStyle, margin: "0 0 8px", fontWeight: 700 }}>
            {`Votre plan ${planName} compte déjà ${planTestimonialLimit} témoignages validés.`}
          </Text>
          <Text style={{ ...creatorParagraphStyle, margin: "0 0 12px" }}>
            {`Celui ${prefixPersonWithDe(getFirstName(authorName))} est gardé, en attente${NO_BREAK_SPACE}: rien n'est perdu. Avec Essentiel, à ${essentielPrice} par mois, tous vos témoignages s'affichent.`}
          </Text>
          <Text style={{ ...creatorParagraphStyle, margin: "0 0 12px", fontSize: "15px", lineHeight: "22px" }}>
            {launchPrice ? `${launchPrice} Vous payez le prix affiché.` : "Vous payez le prix affiché."}
          </Text>
          <Text style={{ ...creatorParagraphStyle, margin: 0, fontWeight: 700 }}>
            <Link href={`${appUrl}${BILLING_HREF}`} style={creatorLinkStyle}>
              Découvrir le plan Essentiel
            </Link>
          </Text>
        </Section>
      ) : null}
      <CreatorEmailButton href={`${appUrl}${TESTIMONIALS_SECTION_HREF}`} label="Ouvrir mon espace" />
    </AccountEmailLayout>
  );
};
