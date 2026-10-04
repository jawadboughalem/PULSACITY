import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MarketingNav } from "./MarketingNav";

/** Maquettes 7 and 8: 80 px on a computer, 60 on a phone, a hairline below. The logo follows identity v2. */
export const MarketingHeader = () => (
  <header className="relative border-b border-hairline-200 bg-white">
    <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-page-gutter desktop:h-[80px]">
      <Link
        href="/"
        aria-label="Pulsacity, accueil"
        className="text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
      >
        <BrandLogo variant="small" height={24} alt="" className="desktop:hidden" />
        <BrandLogo variant="regular" height={32} alt="" className="hidden desktop:block" />
      </Link>
      <MarketingNav />
    </div>
  </header>
);
