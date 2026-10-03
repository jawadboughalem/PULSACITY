"use client";

import { useState, useTransition } from "react";
import { askToBeNotified } from "@/app/app/(espace)/connecteurs/connector-actions";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type WaitlistButtonProps = {
  connector: string;
  connectorName: string;
  isWaiting: boolean;
};

export const WaitlistButton = ({ connector, connectorName, isWaiting }: WaitlistButtonProps) => {
  const [isDone, setIsDone] = useState(isWaiting);
  const [hasFailed, setHasFailed] = useState(false);
  const [isSaving, startSaving] = useTransition();

  if (isDone) {
    return (
      <p role="status" className="flex min-h-[48px] items-center gap-2 text-small font-medium text-success">
        <Icon name="valid" size={20} />
        Nous vous préviendrons par e-mail
      </p>
    );
  }

  const handleClick = () => {
    setHasFailed(false);
    startSaving(async () => {
      try {
        const result = await askToBeNotified(connector);
        if (result.ok) setIsDone(true);
        else setHasFailed(true);
      } catch {
        setHasFailed(true);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 desktop:items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSaving}
        aria-label={`Me prévenir quand ${connectorName} sera disponible`}
        className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
      >
        Me prévenir
      </button>
      {hasFailed ? (
        <FieldError
          id={`${connector}-waitlist-error`}
          message="Votre demande n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez."
        />
      ) : null}
    </div>
  );
};
