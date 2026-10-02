import { cn } from "@/lib/cn";

type SwitchProps = {
  id: string;
  isOn: boolean;
  labelId: string;
  descriptionId?: string;
  isDisabled?: boolean;
  onChange: (isOn: boolean) => void;
};

/**
 * An on/off setting that applies at once: Ink with the knob on the right when on, grey when off. Disabled, as in
 * maquette 6 for a setting of a higher plan: Paper with a hairline, and the reason written next to it.
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
      "relative inline-flex h-[28px] w-[48px] shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
      isDisabled
        ? "cursor-not-allowed border border-hairline-200 bg-paper-100"
        : isOn
          ? "border-2 border-ink-900 bg-ink-900"
          : "border-2 border-gray-400 bg-white",
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 size-[20px] -translate-y-1/2 rounded-full transition-[left]",
        isDisabled ? "left-[2px] bg-hairline-200" : isOn ? "left-[22px] bg-white" : "left-[2px] bg-gray-400",
      )}
    />
  </button>
);
