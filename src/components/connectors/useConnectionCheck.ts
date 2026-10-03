"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

/** While waiting, the page looks again on its own, so the light turns green without a click. */
const POLL_INTERVAL_MS = 15_000;

export const useConnectionCheck = (isWaiting: boolean) => {
  const router = useRouter();
  const [isChecking, startChecking] = useTransition();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isWaiting) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isWaiting, router]);

  const check = () => {
    startChecking(() => {
      router.refresh();
      setHasChecked(true);
    });
  };

  return { check, isChecking, hasChecked: hasChecked && !isChecking };
};
