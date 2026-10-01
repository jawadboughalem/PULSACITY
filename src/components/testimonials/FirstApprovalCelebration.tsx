"use client";

import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { BrandSymbol } from "@/components/brand/BrandSymbol";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { FIRST_APPROVAL_SEARCH_PARAM } from "./first-approval-param";

const CelebrationContext = createContext<() => void>(() => undefined);

export const useCelebrateFirstApproval = () => useContext(CelebrationContext);

/** The one success banner that carries the symbol, with its take-off. */
export const FirstApprovalBanner = () => (
  <StatusBanner
    tone="success"
    title="Votre premier témoignage est en ligne."
    icon={
      <span className="pz-decollage flex">
        <BrandSymbol variant="small" size={24} />
      </span>
    }
  />
);

type FirstApprovalCelebrationProps = {
  /** Set when the page opens right after the first validated testimonial was added. */
  isInitiallyShown?: boolean;
  children: ReactNode;
};

/** The server records the moment as it happens: a reload or another device never plays it again. */
export const FirstApprovalCelebration = ({ isInitiallyShown = false, children }: FirstApprovalCelebrationProps) => {
  const [isShown, setIsShown] = useState(isInitiallyShown);

  useEffect(() => {
    if (!isInitiallyShown) return;
    const url = new URL(window.location.href);
    url.searchParams.delete(FIRST_APPROVAL_SEARCH_PARAM);
    window.history.replaceState(window.history.state, "", url);
  }, [isInitiallyShown]);

  return (
    <CelebrationContext.Provider value={() => setIsShown(true)}>
      {isShown ? <FirstApprovalBanner /> : null}
      {children}
    </CelebrationContext.Provider>
  );
};
