import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { MarketingNav } from "./MarketingNav";
import { StickyHeader } from "./StickyHeader";

/** Charte v2, Navigation du site: 88 high on a computer with the logo at 32, 64 on a phone with the small one at 24. */
export const MarketingHeader = () => (
  <StickyHeader>
    <div className="px-page-gutter">
      <div className="relative mx-auto flex h-[64px] max-w-content items-center justify-between desktop:h-[88px]">
        <Link href="/" aria-label="Pulsacity, accueil" className={cn("rounded-field", FOCUS_RING)}>
          <BrandLogo variant="small" height={24} alt="" className="desktop:hidden" />
          <BrandLogo variant="regular" height={32} alt="" className="hidden desktop:block" />
        </Link>
        <MarketingNav />
      </div>
    </div>
  </StickyHeader>
);
