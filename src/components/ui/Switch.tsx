import { cn } from "@/lib/cn";
import { FOCUS_RING } from "./button-styles";

type SwitchProps = {
  id: string;
  isOn: boolean;
  labelId: string;
  descriptionId?: string;
  isDisabled?: boolean;
  onChange: (isOn: boolean) => void;
};

/**
 * Charte v2, Interrupteur: a 52 × 32 track in a 44 zone. On: Encre track, Soleil knob 24 on the right. Off: Gris clair
 * track bordered in Gris, Gris knob 22. Disabled (a setting of a higher plan): Gris clair, its border Bord désactivé,
 * and the reason written next to it. The knob glides in 240 ms.
 */
export const Switch = ({ id, isOn, labelId, descriptionId, isDisabled = false, onChange }: SwitchProps) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={isOn}
    aria-labelledby={labelId}
    aria-describedby={descriptionId}
    disabled={isDisabled}
    onClick={() => onChange(!isOn)}
    className={cn(
      "group flex h-[44px] w-[52px] shrink-0 cursor-pointer items-center rounded-full disabled:cursor-not-allowed",
      FOCUS_RING,
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "pz-couleur relative block h-[32px] w-[52px] rounded-full border-2",
        isDisabled
          ? "border-disabled-border bg-gray-light"
          : isOn
            ? "border-ink bg-ink"
            : "border-gray bg-gray-light",
      )}
    >
      <span
        className={cn(
          "pz-interrupteur-pouce absolute top-1/2 left-[2px] -mt-[12px] block size-[24px] rounded-full",
          isOn ? "translate-x-[20px]" : "translate-x-[0] scale-[0.9167]",
          isDisabled ? "bg-disabled-border" : isOn ? "bg-sun" : "bg-gray",
        )}
      />
    </span>
  </button>
);
