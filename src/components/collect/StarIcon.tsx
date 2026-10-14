import { useId } from "react";
import { STAR_PATH } from "@/components/ui/icon-paths";
import { cn } from "@/lib/cn";

export type StarFill = "full" | "half" | "empty";

type StarIconProps = {
  /** Charte v2: 16 in badges and lists, 18 in tables, 20 in cards, 46 in a 56 target (collect page). */
  size: 16 | 18 | 20 | 36 | 46;
  isFilled?: boolean;
  fill?: StarFill;
};

/** Charte v2, Étoiles de note: full in Soleil with a 1.3 Encre outline, empty a 1.5 Gris outline, half for averages. */
export const StarIcon = ({ size, isFilled = false, fill = isFilled ? "full" : "empty" }: StarIconProps) => {
  const halfId = `star-half-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      {fill === "half" ? (
        <defs>
          <clipPath id={halfId}>
            <rect width="12" height="24" />
          </clipPath>
        </defs>
      ) : null}
      <path
        d={STAR_PATH}
        strokeWidth={fill === "full" ? 1.3 : 1.5}
        strokeLinejoin="round"
        className={cn(fill === "full" ? "fill-sun stroke-ink" : "fill-none stroke-gray")}
      />
      {fill === "half" ? (
        <path
          d={STAR_PATH}
          strokeWidth={1.3}
          strokeLinejoin="round"
          clipPath={`url(#${halfId})`}
          className="fill-sun stroke-ink"
        />
      ) : null}
    </svg>
  );
};
