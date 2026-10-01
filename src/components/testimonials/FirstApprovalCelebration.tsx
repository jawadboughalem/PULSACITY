"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { BrandSymbol } from "@/components/brand/BrandSymbol";
import { StatusBanner } from "@/components/ui/StatusBanner";

const CelebrationContext = createContext<() => void>(() => undefined);

export const useCelebrateFirstApproval = () => useContext(CelebrationContext);

type FirstApprovalCelebrationProps = {
  children: ReactNode;
};

/** The one success banner that carries the symbol, with its take-off: the server has recorded that it happened. */
export const FirstApprovalCelebration = ({ children }: FirstApprovalCelebrationProps) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <CelebrationContext.Provider value={() => setIsShown(true)}>
      {isShown ? (
        <StatusBanner
          tone="success"
          title="Votre premier témoignage est en ligne."
          icon={
            <span className="pz-decollage mt-[0] flex">
              <BrandSymbol variant="small" size={24} />
            </span>
          }
        />
      ) : null}
      {children}
    </CelebrationContext.Provider>
  );
};
