"use client";

import { useActionState, useState } from "react";
import { type RequestMagicLinkResult, requestMagicLink } from "@/app/(auth)/request-magic-link";

export const useMagicLinkRequest = () => {
  const [result, submitAction, isPending] = useActionState(requestMagicLink, null);
  const [email, setEmail] = useState("");
  const [dismissedResult, setDismissedResult] = useState<RequestMagicLinkResult | null>(null);

  const isSent = result?.ok === true && result !== dismissedResult;
  const error = result?.ok === false && result !== dismissedResult ? result.error : null;

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    if (result?.ok === false) setDismissedResult(result);
  };

  const handleUseAnotherAddress = () => {
    setDismissedResult(result);
  };

  return { email, isSent, error, isPending, submitAction, handleChangeEmail, handleUseAnotherAddress };
};
