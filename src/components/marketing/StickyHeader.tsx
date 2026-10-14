"use client";

import { type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** The page has scrolled this far: the header takes its floating shadow (charte v2, Navigation). */
const SCROLL_BEFORE_SHADOW_PX = 8;

type StickyHeaderProps = {
  children: ReactNode;
};

/** The site's header stays at the top, white, without rule or shadow until the page scrolls by 8 px. */
export const StickyHeader = ({ children }: StickyHeaderProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > SCROLL_BEFORE_SHADOW_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header data-site-header className={cn("pz-couleur sticky top-[0] z-30 bg-white", hasScrolled && "shadow-float")}>
      {children}
    </header>
  );
};
