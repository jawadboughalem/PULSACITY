"use client";

import { useActionState, useState } from "react";
import { type RequestMagicLinkResult, requestMagicLink } from "@/app/(auth)/request-magic-link";

export const useMagicLinkRequest = () => {
  const [result, submitAction, isPending] = useActionState(requestMagicLink, null);
  const [email, setEmail] = useState("");
  // Kept after an error, like the address (maquette 3.4, « réponse gardée en cas d'erreur »).
  const [heardFrom, setHeardFrom] = useState("");
  const [dismissedResult, setDismissedResult] = useState<RequestMagicLinkResult | null>(null);

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

  return {
    email,
    heardFrom,
    isSent,
    error,
    isPending,
    submitAction,
    handleChangeEmail,
    handleChangeHeardFrom,
    handleUseAnotherAddress,
  };
};
