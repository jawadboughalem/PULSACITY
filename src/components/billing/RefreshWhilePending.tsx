"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EVERY_MS = 4000;

/** Five minutes at most: past that, the e-mail promised by the banner takes over. */
const AT_MOST = 75;

/** « Cette page se met à jour toute seule »: while the payment is being confirmed, the page reads it again. */
export const RefreshWhilePending = () => {
  const router = useRouter();
  useEffect(() => {
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      if (count > AT_MOST) window.clearInterval(timer);
      else router.refresh();
    }, EVERY_MS);
    return () => window.clearInterval(timer);
  }, [router]);
  return null;
};
