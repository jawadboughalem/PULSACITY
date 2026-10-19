"use client";

import { type FormEvent, startTransition, useActionState, useEffect, useRef, useState } from "react";
import { type RequestMagicLinkResult, requestMagicLink } from "@/app/(auth)/request-magic-link";

/** `onSent`: once per link sent (the sign-up's event for the audience). */
export const useMagicLinkRequest = (onSent?: (heardFrom: string) => void) => {
  const [result, submitAction, isPending] = useActionState(requestMagicLink, null);
  const [email, setEmail] = useState("");
  // Kept after an error, like the address (maquette 3.4, « réponse gardée en cas d'erreur »).
  const [heardFrom, setHeardFrom] = useState("");
  const [dismissedResult, setDismissedResult] = useState<RequestMagicLinkResult | null>(null);

  const onSentRef = useRef(onSent);
  const heardFromRef = useRef(heardFrom);
  useEffect(() => {
    onSentRef.current = onSent;
    heardFromRef.current = heardFrom;
  });
  useEffect(() => {
    if (result?.ok === true) onSentRef.current?.(heardFromRef.current);
  }, [result]);

  const isSent = result?.ok === true && result !== dismissedResult;
  const error = result?.ok === false && result !== dismissedResult ? result.error : null;

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    if (result?.ok === false) setDismissedResult(result);
  };

  const handleChangeHeardFrom = (value: string) => {
    setHeardFrom(value);
  };

  const handleUseAnotherAddress = () => {
    setDismissedResult(result);
  };

  // Sent from onSubmit, not from the form's action: React resets a form after its action, and a controlled
  // <select> stays on its first option (the answer would be lost after an error).
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => submitAction(formData));
  };

  return {
    email,
    heardFrom,
    isSent,
    error,
    isPending,
    handleSubmit,
    handleChangeEmail,
    handleChangeHeardFrom,
    handleUseAnotherAddress,
  };
};
