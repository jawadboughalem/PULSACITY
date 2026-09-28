"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { TextColumnPage } from "@/components/ui/TextColumnPage";
import { cn } from "@/lib/cn";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <TextColumnPage>
      <title>Page indisponible · PULSACITY</title>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-h1 font-medium">Cette page n&apos;a pas pu s&apos;afficher</h1>
        <p className="text-body text-slate-600">
          Le problème vient de chez nous, pas de vous. Réessayez dans quelques instants.
        </p>
      </div>
      <button type="button" onClick={retry} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
        Réessayer
      </button>
    </TextColumnPage>
  );
};

export default ErrorPage;
