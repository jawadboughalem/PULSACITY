"use client";

import { useState, useTransition } from "react";
import { askToBeNotified } from "@/app/app/(espace)/connecteurs/connector-actions";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type WaitlistButtonProps = {
  connector: string;
  connectorName: string;
  isWaiting: boolean;
};

/**
 * « Me prévenir », then, on the spot, « Nous vous préviendrons par e-mail » in Pousse: where the creator clicked, even
 * far down the catalogue. Screen readers hear the whole sentence.
 */
export const WaitlistButton = ({ connector, connectorName, isWaiting }: WaitlistButtonProps) => {
  const [isDone, setIsDone] = useState(isWaiting);
  const [hasJustAsked, setHasJustAsked] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isSaving, startSaving] = useTransition();

  const handleClick = () => {
    setHasFailed(false);
    startSaving(async () => {
      try {
        const result = await askToBeNotified(connector);
        if (result.ok) {
          setIsDone(true);
          setHasJustAsked(true);
        } else setHasFailed(true);
      } catch {
        setHasFailed(true);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 desktop:items-end">
      {/* Always there, so that it is announced when the sentence arrives. */}
      <span aria-live="polite" className="sr-only">
        {hasJustAsked ? `C'est noté : nous vous écrirons le jour de la sortie de ${connectorName}.` : ""}
      </span>
      {isDone ? (
        <p className="flex min-h-[44px] items-center gap-2 text-small font-bold text-success">
          <Icon name="valid" size={20} />
          Nous vous préviendrons par e-mail
        </p>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isSaving}
          aria-label={`Me prévenir quand ${connectorName} sera disponible`}
          className={cn(SECONDARY_COMPACT_BUTTON_CLASSES, "w-full desktop:w-auto")}
        >
          Me prévenir
        </button>
      )}
      {hasFailed ? (
        <FieldError
          id={`${connector}-waitlist-error`}
          message="Votre demande n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez."
        />
      ) : null}
    </div>
  );
};
