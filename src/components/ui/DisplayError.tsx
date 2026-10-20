"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "./button-styles";
import { ErrorScreen } from "./ErrorScreen";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

type DisplayErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Maquettes 3.5, Affichage impossible: the text of m14, which says the data is safe; « Réessayer » renders the page
 * again. Shared by the error of a page and by the error of the root layout.
 */
export const DisplayError = ({ error, retry }: DisplayErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <>
      <title>Page indisponible · PULSACITY</title>
      <ErrorScreen
        icon="alert"
        title="Cette page n'a pas pu s'afficher"
        text="Le problème vient de chez nous, et vos données ne sont pas touchées. Réessayez dans un instant."
        action={
          <button type="button" onClick={retry} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
            <Icon name="replay" size={20} />
            Réessayer
          </button>
        }
        link={
          <Link href="/" className={DISCREET_BUTTON_CLASSES}>
            Revenir à l&apos;accueil
          </Link>
        }
      />
    </>
  );
};
