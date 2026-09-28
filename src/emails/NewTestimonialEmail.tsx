import { Img, Section, Text } from "react-email";
import { prefixWithDe } from "@/lib/french/prefix-with-de";
import { AccountEmailLayout } from "./AccountEmailLayout";
import { EmailButton } from "./EmailButton";
import { EMAIL_COLORS, paragraphStyle, quoteStyle, smallStyle } from "./email-styles";

const MAX_RATING = 5;

export const buildNewTestimonialSubject = (authorFirstName: string, rating: number) =>
  `Nouveau témoignage ${prefixWithDe(authorFirstName)} (${rating}/${MAX_RATING})`;

type NewTestimonialEmailProps = {
  spaceName: string;
  productName: string | null;
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  body: string;
  spaceUrl: string;
  planName: string;
  planTestimonialLimit: number | null;
  isOverPlanLimit: boolean;
};

export const NewTestimonialEmail = ({
  spaceName,
  productName,
  authorName,
  authorTitle,
  authorPhotoUrl,
  rating,
  body,
  spaceUrl,
  planName,
  planTestimonialLimit,
  isOverPlanLimit,
}: NewTestimonialEmailProps) => (
  <AccountEmailLayout
    preview={`${rating} sur ${MAX_RATING} : « ${body.slice(0, 90)} »`}
    legalNotice={`Vous recevez cet e-mail parce qu'un client a laissé un avis sur la page de collecte ${prefixWithDe(spaceName)}.`}
  >
    <Text style={paragraphStyle}>Bonjour,</Text>
    <Text style={paragraphStyle}>
      {productName
        ? `Un nouveau témoignage sur ${productName} vient d'arriver dans votre espace ${spaceName}.`
        : `Un nouveau témoignage vient d'arriver dans votre espace ${spaceName}.`}
    </Text>
    <Section style={{ margin: "0 0 24px", padding: "24px", border: `1px solid ${EMAIL_COLORS.hairline200}` }}>
      <Text style={{ ...smallStyle, margin: "0 0 12px", fontSize: "16px", lineHeight: "24px" }}>
        <span style={{ color: EMAIL_COLORS.carmine }}>{"★".repeat(rating)}</span>
        <span style={{ color: EMAIL_COLORS.gray400 }}>{"☆".repeat(MAX_RATING - rating)}</span>
        <span style={{ color: EMAIL_COLORS.ink900 }}>{` ${rating} sur ${MAX_RATING}`}</span>
      </Text>
      <Text style={quoteStyle}>{`« ${body} »`}</Text>
      {authorPhotoUrl ? (
        <Img src={authorPhotoUrl} width="64" height="64" alt="" style={{ borderRadius: "999px", margin: "0 0 12px" }} />
      ) : null}
      <Text style={{ ...smallStyle, color: EMAIL_COLORS.ink900, fontWeight: 600 }}>
        {authorTitle ? `${authorName} · ${authorTitle}` : authorName}
      </Text>
      <Text style={{ ...smallStyle, margin: "12px 0 0", color: EMAIL_COLORS.attention }}>
        En attente de votre validation.
      </Text>
    </Section>
    {isOverPlanLimit && planTestimonialLimit !== null ? (
      <Section
        style={{ margin: "0 0 24px", padding: "16px", backgroundColor: EMAIL_COLORS.attentionSurface }}
      >
        <Text style={{ ...smallStyle, color: EMAIL_COLORS.attention }}>
          {`Votre plan ${planName} inclut ${planTestimonialLimit} témoignages. Celui-ci est bien conservé, en attente. Passez au plan Essentiel pour le publier.`}
        </Text>
      </Section>
    ) : null}
    <EmailButton href={spaceUrl} label="Ouvrir mon espace" />
  </AccountEmailLayout>
);
