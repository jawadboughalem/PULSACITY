"use client";

import { useActionState, useState } from "react";
import { createSpaceFromOnboarding } from "@/app/app/onboarding/create-space-from-onboarding";
import { requestLogoUpload } from "@/app/app/onboarding/request-logo-upload";
import { useImageUpload } from "@/components/uploads/useImageUpload";
import { slugify } from "@/lib/spaces/slugify";

export const useSpaceForm = (defaultReplyToEmail: string) => {
  const [result, submitAction, isPending] = useActionState(createSpaceFromOnboarding, null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState(defaultReplyToEmail);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const logoUpload = useImageUpload("image/png", requestLogoUpload);

  const fieldErrors = result?.error === "invalid-input" ? result.fieldErrors : {};
  const suggestedSlug = result?.error === "slug-taken" && slug !== result.suggestedSlug ? result.suggestedSlug : null;

  const handleChangeName = (value: string) => {
    setName(value);
    if (!isSlugEdited) setSlug(slugify(value));
  };

  const handleChangeSlug = (value: string) => {
    setIsSlugEdited(true);
    setSlug(value.toLowerCase());
  };

  const handleUseSuggestedSlug = () => {
    if (suggestedSlug) handleChangeSlug(suggestedSlug);
  };

  return {
    name,
    slug,
    replyToEmail,
    accentColor,
    logoUpload,
    fieldErrors,
    suggestedSlug,
    isPending,
    submitAction,
    handleChangeName,
    handleChangeSlug,
    handleUseSuggestedSlug,
    setReplyToEmail,
    setAccentColor,
  };
};
