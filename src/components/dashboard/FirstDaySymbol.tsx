"use client";

import { useEffect } from "react";
import { markMilestone } from "@/app/app/(espace)/space-milestone-actions";
import { BrandSymbol } from "@/components/brand/BrandSymbol";
import { cn } from "@/lib/cn";

type FirstDaySymbolProps = {
  /** True the first time only: the server records it as soon as it plays. */
  shouldTakeOff: boolean;
};

export const FirstDaySymbol = ({ shouldTakeOff }: FirstDaySymbolProps) => {
  useEffect(() => {
    if (shouldTakeOff) void markMilestone("first-day-celebrated").catch(() => undefined);
  }, [shouldTakeOff]);

  return (
    <span className={cn("flex", shouldTakeOff && "pz-decollage")}>
      <BrandSymbol variant="regular" size={48} />
    </span>
  );
};
