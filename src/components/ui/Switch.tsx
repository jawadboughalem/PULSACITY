import { cn } from "@/lib/cn";

type SwitchProps = {
  id: string;
  isOn: boolean;
  labelId: string;
  descriptionId?: string;
  onChange: (isOn: boolean) => void;
};

/** An on/off setting that applies at once: Ink with the knob on the right when on, grey when off. */
export const Switch = ({ id, isOn, labelId, descriptionId, onChange }: SwitchProps) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={isOn}
    aria-labelledby={labelId}
    aria-describedby={descriptionId}
    onClick={() => onChange(!isOn)}
    className={cn(
      "relative inline-flex h-[28px] w-[48px] shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
      isOn ? "border-ink-900 bg-ink-900" : "border-gray-400 bg-white",
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-1/2 size-[20px] -translate-y-1/2 rounded-full transition-[left]",
        isOn ? "left-[22px] bg-white" : "left-[2px] bg-gray-400",
      )}
    />
  </button>
);
