"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { withSignupSource } from "@/lib/acquisition/signup-source";
import { useSignupSource } from "./signup-source-store";

type SignUpLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  /** /inscription by default; a plan's payment (Tarifs) leads to the sign-up too, without a session. */
  href?: string;
};

/**
 * « Créer mon espace gratuit » and every way to the sign-up: the link carries the source of the visit in its address,
 * so that the space records it once created.
 */
export const SignUpLink = ({ href = MARKETING_PATHS.signUp, ...linkProps }: SignUpLinkProps) => {
  const source = useSignupSource();
  return <Link href={withSignupSource(href, source)} {...linkProps} />;
};
