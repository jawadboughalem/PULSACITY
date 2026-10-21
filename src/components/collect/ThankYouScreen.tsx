"use client";

import { useEffect, useRef } from "react";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";
import { getFirstName } from "@/lib/testimonials/format-customer-name";
import { formatExcerpt } from "@/lib/testimonials/format-excerpt";
import { RATINGS } from "@/lib/testimonials/ratings";
import { COLLECT_TITLE_CLASSES } from "./CollectShell";
import { StarIcon } from "./StarIcon";
import type { SentTestimonial } from "./useTestimonialForm";

const THANK_YOU_MESSAGE = "Votre message vient de m'arriver. Merci d'avoir pris le temps de l'écrire.";

type ThankYouScreenProps = {
  testimonial: SentTestimonial;
  spaceName: string;
  logoUrl: string | null;
  accentColor: string | null;
  starColor: string | null;
};

/**
 * Maquettes 3.6, « Envoi réussi »: the success banner, the creator's card on the tint of their accent, then the
 * testimonial as sent, without its photo. The page has no header: the creator is in the card.
 */
export const ThankYouScreen = ({ testimonial, spaceName, logoUrl, accentColor, starColor }: ThankYouScreenProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accent = readAccentButtonColors(accentColor);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <StatusBanner tone="success" title="Votre témoignage est bien envoyé." />
      <div className="flex flex-col gap-4 rounded-card bg-(--tint) p-6 desktop:p-8">
        <SpaceAvatar
          name={spaceName}
          logoUrl={logoUrl}
          size={64}
          background="sky"
          colors={accent ? { background: accent.background, text: accent.text } : undefined}
        />
        <h1 ref={headingRef} tabIndex={-1} className={`${COLLECT_TITLE_CLASSES} focus:outline-none`}>
          {`Merci ${getFirstName(testimonial.authorName)}.`}
        </h1>
        <p className="text-[19px] leading-[28px] desktop:text-lead">{THANK_YOU_MESSAGE}</p>
        <p className="text-body font-bold">{spaceName}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-small font-bold">Votre témoignage</h2>
        <div className="flex flex-col gap-2 rounded-card bg-widget-light-card px-5 py-4">
          <div role="img" aria-label={`${testimonial.rating} sur ${RATINGS.length}`} className="flex gap-[2px]">
            {RATINGS.map((value) => (
              <StarIcon key={value} size={16} isFilled={value <= testimonial.rating} solidColor={starColor} />
            ))}
          </div>
          <p className="text-small">{`« ${formatExcerpt(testimonial.body)} »`}</p>
          <p className="text-small text-gray">
            {testimonial.authorTitle ? `${testimonial.authorName} · ${testimonial.authorTitle}` : testimonial.authorName}
          </p>
        </div>
      </div>
      <p className="text-small text-gray">{`${spaceName} le relit avant de le publier. Vous pouvez fermer cette page.`}</p>
    </div>
  );
};
