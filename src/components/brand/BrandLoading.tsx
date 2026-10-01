"use client";

import { useEffect, useState } from "react";
import { BrandSymbol } from "./BrandSymbol";

const DELAY_BEFORE_SHOWING_MS = 1000;

type BrandLoadingProps = {
  title: string;
  detail: string;
};

/** ChargementMarque of the identity v2: nothing before 1 s, then the breathing star. */
export const BrandLoading = ({ title, detail }: BrandLoadingProps) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsShown(true), DELAY_BEFORE_SHOWING_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div role="status" className="pz-chargement flex flex-1 flex-col items-center justify-center gap-4 px-5 py-9 text-center">
      {isShown ? (
        <>
          <BrandSymbol variant="regular" size={48} />
          <div className="flex flex-col gap-1">
            <p className="text-body font-semibold">{title}</p>
            <p className="text-small text-slate-600">{detail}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};
