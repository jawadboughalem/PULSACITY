"use client";

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
  referralCode: string;
  homeUrl: string;
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
  referralCode,
  homeUrl,
  title,
  consentText,
  incentive,
}: CollectionViewProps) => {
  const form = useTestimonialForm({ spaceSlug, productSlug, requestToken, prefilledName });
  const space = { spaceName, logoUrl, homeUrl, referralCode };

  if (form.sentTestimonial) return <ThankYouScreen testimonial={form.sentTestimonial} {...space} />;
  if (form.isLinkInactive) return <InactiveLinkScreen replyToEmail={replyToEmail} {...space} />;
  return (
    <TestimonialFormScreen
      form={form}
      title={title}
      consentText={consentText}
      accentColor={accentColor}
      incentive={incentive}
      {...space}
    />
  );
};
