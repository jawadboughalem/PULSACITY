"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { withSignupSource } from "@/lib/acquisition/signup-source";
import { useSignupSource } from "./signup-source-store";

type SignUpLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  /** /inscription by default; a plan's payment (Tarifs) leads to the sign-up too, without a session. */
  href?: string;
  /** Where the button is, for the audience (« en-tete », « accueil »…): the event « creer-mon-espace ». */
  place: string;
  /** Another event than « creer-mon-espace », with its words (Tarifs: « choisir-un-plan », its plan and period). */
  event?: { name: string; data: Record<string, string> };
};

/**
 * « Créer mon espace gratuit » and every way to the sign-up: the link carries the source of the visit in its address,
 * so that the space records it once created.
 */
export const SignUpLink = ({ href = MARKETING_PATHS.signUp, place, event, ...linkProps }: SignUpLinkProps) => {
  const source = useSignupSource();
  const eventData = Object.fromEntries(
    Object.entries({ emplacement: place, ...event?.data }).map(([key, value]) => [`data-umami-event-${key}`, value]),
  );
  return (
    <Link
      href={withSignupSource(href, source)}
      data-umami-event={event?.name ?? "creer-mon-espace"}
      {...eventData}
      {...linkProps}
    />
  );
};
