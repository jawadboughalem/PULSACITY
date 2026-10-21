"use client";

import { readAccentStarColor } from "@/lib/colors/accent-button-colors";
import { CollectShell } from "./CollectShell";
import { InactiveLinkScreen } from "./InactiveLinkScreen";
import type { CollectionIncentive } from "./IncentiveNote";
import { TestimonialFormScreen } from "./TestimonialFormScreen";
import { ThankYouScreen } from "./ThankYouScreen";
import { type CollectionContext, useTestimonialForm } from "./useTestimonialForm";

type CollectionViewProps = CollectionContext & {
  spaceName: string;
  logoUrl: string | null;
  accentColor: string | null;
  replyToEmail: string;
  /** « Propulsé par PULSACITY » and its referral link; null on PULSACITY's own pages. */
  poweredBy: { homeUrl: string; referralCode: string } | null;
  title: string;
  consentText: string;
  incentive: CollectionIncentive | null;
};

export const CollectionView = ({
  spaceSlug,
  productSlug,
  requestToken,
  prefilledName,
  spaceName,
  logoUrl,
  accentColor,
  replyToEmail,
  poweredBy,
  title,
  consentText,
  incentive,
}: CollectionViewProps) => {
  const form = useTestimonialForm({ spaceSlug, productSlug, requestToken, prefilledName });
  const identity = { name: spaceName, logoUrl, accentColor };
  const starColor = readAccentStarColor(accentColor);

  if (form.sentTestimonial) {
    return (
      <CollectShell identity={identity} hasHeader={false} poweredBy={poweredBy}>
        <ThankYouScreen
          testimonial={form.sentTestimonial}
          spaceName={spaceName}
          logoUrl={logoUrl}
          accentColor={accentColor}
          starColor={starColor}
        />
      </CollectShell>
    );
  }
  return (
    <CollectShell identity={identity} poweredBy={poweredBy}>
      {form.isLinkInactive ? (
        <InactiveLinkScreen spaceName={spaceName} replyToEmail={replyToEmail} />
      ) : (
        <TestimonialFormScreen
          form={form}
          title={title}
          consentText={consentText}
          spaceName={spaceName}
          accentColor={accentColor}
          starColor={starColor}
          incentive={incentive}
        />
      )}
    </CollectShell>
  );
};
