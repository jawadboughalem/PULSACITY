"use client";

import { useActionState, useEffect, useState } from "react";
import { type SaveSpaceSettingsResult, saveSpaceSettings } from "@/app/app/(espace)/reglages/settings-actions";
import { requestLogoUpload } from "@/app/app/onboarding/request-logo-upload";
import { useImageUpload } from "@/components/uploads/useImageUpload";

export type SpaceSettingsValues = {
  name: string;
  slug: string;
  accentColor: string | null;
  logoUrl: string | null;
  replyToEmail: string;
  senderPostalAddress: string | null;
  newTestimonialEmailEnabled: boolean;
  offersIncentive: boolean;
};

/** Each submission is counted: the summary of errors takes the focus again, even when the errors stay the same. */
type Submission = { result: SaveSpaceSettingsResult; count: number };

export const useSpaceSettingsForm = (initial: SpaceSettingsValues, onSaved: () => void) => {
  const [submission, submitAction, isPending] = useActionState<Submission | null, FormData>(
    async (previous, formData) => ({
      result: await saveSpaceSettings(previous?.result ?? null, formData),
      count: (previous?.count ?? 0) + 1,
    }),
    null,
  );
  const result = submission?.result ?? null;
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [accentColor, setAccentColor] = useState(initial.accentColor ?? "");
  const [replyToEmail, setReplyToEmail] = useState(initial.replyToEmail);
  const [senderPostalAddress, setSenderPostalAddress] = useState(initial.senderPostalAddress ?? "");
  const [isNewTestimonialEmailEnabled, setIsNewTestimonialEmailEnabled] = useState(initial.newTestimonialEmailEnabled);
  const [offersIncentive, setOffersIncentive] = useState(initial.offersIncentive);
  const [isLogoRemoved, setIsLogoRemoved] = useState(false);
  const logoUpload = useImageUpload("image/png", requestLogoUpload);

  useEffect(() => {
    if (result?.ok) onSaved();
  }, [result, onSaved]);

  const invalidResult = result?.ok === false && result.error === "invalid-input" ? result : null;
  const takenSlugSuggestion = invalidResult?.suggestedSlug ?? null;
  const isSuggestionTaken = takenSlugSuggestion !== null && slug === takenSlugSuggestion;
  const fieldErrors = { ...invalidResult?.fieldErrors, slug: isSuggestionTaken ? undefined : invalidResult?.fieldErrors.slug };
  const suggestedSlug = takenSlugSuggestion && !isSuggestionTaken ? takenSlugSuggestion : null;

  const uploadedLogo = logoUpload.state.status === "uploaded" ? logoUpload.state.image : null;
  const shownLogoUrl = uploadedLogo?.previewUrl ?? (isLogoRemoved ? null : initial.logoUrl);

  const handleRemoveLogo = () => {
    logoUpload.handleRemove();
    setIsLogoRemoved(true);
  };

  return {
    values: {
      name,
      slug,
      accentColor,
      replyToEmail,
      senderPostalAddress,
      isNewTestimonialEmailEnabled,
      offersIncentive,
    },
    setters: {
      setName,
      setSlug: (value: string) => setSlug(value.toLowerCase()),
      setAccentColor,
      setReplyToEmail,
      setSenderPostalAddress,
      setIsNewTestimonialEmailEnabled,
      setOffersIncentive,
    },
    logo: {
      upload: logoUpload,
      shownUrl: shownLogoUrl,
      uploadedKey: uploadedLogo?.key ?? "",
      isRemoved: isLogoRemoved && !uploadedLogo,
      handleSelect: logoUpload.handleSelectFile,
      handleRemove: handleRemoveLogo,
    },
    result,
    submissionCount: submission?.count ?? 0,
    fieldErrors,
    suggestedSlug,
    isPending,
    submitAction,
  };
};

export type SpaceSettingsFormState = ReturnType<typeof useSpaceSettingsForm>;
