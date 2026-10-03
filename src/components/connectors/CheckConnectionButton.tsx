"use client";

import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { CHECK_HINT } from "./ConnectionStatusBanner";
import { useConnectionCheck } from "./useConnectionCheck";

/** Step 3 of maquette 5: looks again for the first sale. The light at the top of the page tells the result. */
export const CheckConnectionButton = ({ isWaiting }: { isWaiting: boolean }) => {
  const { check, isChecking, hasChecked } = useConnectionCheck(false);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={check}
        disabled={isChecking}
        className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
      >
        Vérifier la connexion
      </button>
      <p aria-live="polite" className="text-small text-slate-600">
        {hasChecked && isWaiting ? CHECK_HINT : ""}
      </p>
    </div>
  );
};
