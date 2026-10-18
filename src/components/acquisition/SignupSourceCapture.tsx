"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureSignupSource } from "./signup-source-store";

/** Reads the source of each address the visitor reaches (UTM words, referral code), for the sign-up links to carry. */
export const SignupSourceCapture = () => {
  const pathname = usePathname();
  useEffect(() => {
    captureSignupSource(window.location.search);
  }, [pathname]);
  return null;
};
