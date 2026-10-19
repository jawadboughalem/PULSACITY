"use client";

import { useState, useTransition } from "react";
import { askToBeNotified } from "@/app/app/(espace)/connecteurs/connector-actions";
import { SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useWaitlistNotice } from "./WaitlistNotice";

type WaitlistButtonProps = {
  connector: string;
  connectorName: string;
  isWaiting: boolean;
};

export const WaitlistButton = ({ connector, connectorName, isWaiting }: WaitlistButtonProps) => {
  const [isDone, setIsDone] = useState(isWaiting);
  const [hasFailed, setHasFailed] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const notify = useWaitlistNotice();

  if (isDone) {
    return (
      <p className="flex min-h-[44px] items-center gap-2 text-small font-bold text-success">
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
        if (result.ok) {
          setIsDone(true);
          notify(connectorName);
        }
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
        className={cn(SECONDARY_COMPACT_BUTTON_CLASSES, "w-full desktop:w-auto")}
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
