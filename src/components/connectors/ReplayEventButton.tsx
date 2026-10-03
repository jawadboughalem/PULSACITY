"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { replayEvent } from "@/app/app/(espace)/connecteurs/connector-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

/** « Rejouer »: an event put aside is processed again. A sale already recorded is never recorded twice. */
export const ReplayEventButton = ({ eventId, eventLabel }: { eventId: string; eventLabel: string }) => {
  const router = useRouter();
  const [hasFailed, setHasFailed] = useState(false);
  const [isReplaying, startReplaying] = useTransition();

  const handleClick = () => {
    setHasFailed(false);
    startReplaying(async () => {
      try {
        const result = await replayEvent(eventId);
        if (result.ok) router.refresh();
        else setHasFailed(true);
      } catch {
        setHasFailed(true);
      }
    });
  };

  return (
    <div className="flex flex-col gap-1 desktop:items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={isReplaying}
        aria-label={`Rejouer : ${eventLabel}`}
        className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
      >
        Rejouer
      </button>
      <p aria-live="polite" className="text-small text-error empty:hidden">
        {hasFailed ? "Impossible de rejouer. Réessayez dans un instant." : ""}
      </p>
    </div>
  );
};
