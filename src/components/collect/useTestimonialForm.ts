"use client";

import * as Sentry from "@sentry/nextjs";
import { type FormEvent, useRef, useState, useTransition } from "react";
import { requestTestimonialPhotoUpload } from "@/app/t/[spaceSlug]/request-testimonial-photo-upload";
import { submitTestimonialForm } from "@/app/t/[spaceSlug]/submit-testimonial-form";
import { useImageUpload } from "@/components/uploads/useImageUpload";
import {
  HONEYPOT_FIELD_NAME,
  type TestimonialFieldErrors,
  type TestimonialFormInput,
  collectTestimonialFieldErrors,
  testimonialFormSchema,
} from "@/lib/testimonials/testimonial-form-schema";

export type CollectionContext = {
  spaceSlug: string;
  productSlug: string | null;
  requestToken: string | null;
  prefilledName: string;
};

export type SentTestimonial = {
  authorName: string;
  authorTitle: string | null;
  rating: number;
  body: string;
};

export type SubmitProblem = "too-many-submissions" | "page-not-found" | "invalid-photo" | "invalid-input" | "unavailable";

export const useTestimonialForm = ({ spaceSlug, productSlug, requestToken, prefilledName }: CollectionContext) => {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState(prefilledName);
  const [authorTitle, setAuthorTitle] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasTriedSubmitting, setHasTriedSubmitting] = useState(false);
  const [submitProblem, setSubmitProblem] = useState<SubmitProblem | null>(null);
  const [isLinkInactive, setIsLinkInactive] = useState(false);
  const [sentTestimonial, setSentTestimonial] = useState<SentTestimonial | null>(null);
  const [isSubmitting, startSubmitting] = useTransition();
  const photoUpload = useImageUpload("image/jpeg", (request) => requestTestimonialPhotoUpload(spaceSlug, request));

  const firstStarRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const authorNameRef = useRef<HTMLInputElement>(null);
  const authorTitleRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const input: TestimonialFormInput = {
    spaceSlug,
    productSlug,
    requestToken,
    rating,
    body,
    authorName,
    authorTitle,
    photoKey: photoUpload.state.status === "uploaded" ? photoUpload.state.image.key : null,
    hasConsented,
    [HONEYPOT_FIELD_NAME]: honeypot,
  };
  const validation = testimonialFormSchema.safeParse(input);
  const fieldErrors: TestimonialFieldErrors =
    hasTriedSubmitting && !validation.success ? collectTestimonialFieldErrors(validation.error) : {};

  const focusFirstInvalidField = (errors: TestimonialFieldErrors) => {
    const fields = [
      [errors.rating, firstStarRef],
      [errors.body, bodyRef],
      [errors.authorName, authorNameRef],
      [errors.authorTitle, authorTitleRef],
      [errors.hasConsented, consentRef],
    ] as const;
    fields.find(([error]) => error !== undefined)?.[1].current?.focus();
  };

  const handleInput = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasTriedSubmitting(true);
    setSubmitProblem(null);
    if (!validation.success) {
      focusFirstInvalidField(collectTestimonialFieldErrors(validation.error));
      return;
    }

    const sent: SentTestimonial = {
      authorName: validation.data.authorName,
      authorTitle: validation.data.authorTitle,
      rating: validation.data.rating,
      body: validation.data.body,
    };
    startSubmitting(async () => {
      const result = await submitTestimonialForm(input).catch((error: unknown) => {
        Sentry.captureException(error);
        return null;
      });
      if (!result) {
        setSubmitProblem("unavailable");
        return;
      }
      if (result.ok) {
        setSentTestimonial(sent);
        return;
      }
      if (result.error === "link-inactive") {
        setIsLinkInactive(true);
        return;
      }
      setSubmitProblem(result.error);
    });
  };

  return {
    values: { rating, body, authorName, authorTitle, hasConsented, honeypot },
    setters: { setRating, setBody, setAuthorName, setAuthorTitle, setHasConsented, setHoneypot },
    refs: { firstStarRef, bodyRef, authorNameRef, authorTitleRef, consentRef },
    photoUpload,
    fieldErrors,
    submitProblem,
    isSubmitting,
    isLinkInactive,
    sentTestimonial,
    showsPrefilledNameHint: prefilledName !== "" && !hasInteracted,
    handleInput,
    handleSubmit,
  };
};

export type TestimonialFormState = ReturnType<typeof useTestimonialForm>;
