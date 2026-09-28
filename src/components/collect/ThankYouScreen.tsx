"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { getFirstName } from "@/lib/testimonials/format-customer-name";
import { formatExcerpt } from "@/lib/testimonials/format-excerpt";
import { RATINGS } from "@/lib/testimonials/testimonial-form-schema";
import { PoweredByPulsacity } from "./PoweredByPulsacity";
import { StarIcon } from "./StarIcon";
import type { SentTestimonial } from "./useTestimonialForm";

const THANK_YOU_MESSAGE = "Votre message vient de m'arriver. Merci d'avoir pris le temps de l'écrire.";

type ThankYouScreenProps = {
  testimonial: SentTestimonial;
  spaceName: string;
  logoUrl: string | null;
  homeUrl: string;
  referralCode: string;
};

export const ThankYouScreen = ({ testimonial, spaceName, logoUrl, homeUrl, referralCode }: ThankYouScreenProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <div
        role="status"
        className="flex items-center gap-2 rounded-lg bg-success-surface px-4 py-3 text-small font-medium text-success"
      >
        <Icon name="valid" size={20} />
        Votre témoignage est bien envoyé.
      </div>
      <div className="flex flex-col gap-4 rounded-lg border-2 border-ink-900 bg-white p-5">
        <SpaceAvatar name={spaceName} logoUrl={logoUrl} size={64} background="paper" />
        <h1 ref={headingRef} tabIndex={-1} className="font-serif text-h2 font-medium focus:outline-none">
          {`Merci ${getFirstName(testimonial.authorName)}.`}
        </h1>
        <p className="font-serif text-quote">{THANK_YOU_MESSAGE}</p>
        <p className="border-t border-hairline-200 pt-4 font-serif text-quote font-medium">{spaceName}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-small font-semibold">Votre témoignage</h2>
        <div className="flex flex-col gap-2 rounded-lg border border-hairline-200 bg-white p-4">
          <div role="img" aria-label={`${testimonial.rating} sur ${RATINGS.length}`} className="flex gap-[2px]">
            {RATINGS.map((value) => (
              <StarIcon key={value} size={16} isFilled={value <= testimonial.rating} />
            ))}
          </div>
          <p className="text-small">{`« ${formatExcerpt(testimonial.body)} »`}</p>
          <p className="text-small text-slate-600">
            {testimonial.authorTitle ? `${testimonial.authorName} · ${testimonial.authorTitle}` : testimonial.authorName}
          </p>
        </div>
        <p className="text-small text-slate-600">
          {`${spaceName} le relit avant de le publier. Vous pouvez fermer cette page.`}
        </p>
      </div>
      <PoweredByPulsacity homeUrl={homeUrl} referralCode={referralCode} className="mt-auto" />
    </>
  );
};
