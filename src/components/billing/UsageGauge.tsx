import { cn } from "@/lib/cn";

type UsageGaugeProps = {
  label: string;
  value: number;
  max: number;
  /** At the limit or over it: « Limite atteinte », or the rule that applies (« Le widget en montre 15… »). */
  note: string | null;
};

/**
 * Charte v2 (3.3), Jauge de consommation: the label on the left, « 12 sur 15 » on the right, a bar of 10 on Ciel filled
 * in Encre, in Attente at the limit or over it.
 */
export const UsageGauge = ({ label, value, max, note }: UsageGaugeProps) => {
  const isAtLimit = value >= max;
  return (
    <div className="flex min-w-[0] flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-small font-bold">{label}</span>
        <span className="text-small whitespace-nowrap">
          <span className="text-body font-bold tabular-nums">{value}</span> sur {max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${value} sur ${max}`}
        className="h-[10px] overflow-hidden rounded-full bg-sky"
      >
        <div
          className={cn("h-full rounded-full", isAtLimit ? "bg-waiting" : "bg-ink")}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        />
      </div>
      {isAtLimit && note ? <p className="text-badge font-bold text-waiting">{note}</p> : null}
    </div>
  );
};
