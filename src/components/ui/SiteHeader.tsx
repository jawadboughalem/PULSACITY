import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const SiteHeader = () => (
  <header className="flex h-[60px] shrink-0 items-center border-b border-hairline-200 px-page-gutter">
    <Link
      href="/"
      aria-label="Pulsacity, accueil"
      className="text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      <BrandLogo variant="small" height={24} alt="" className="desktop:hidden" />
      <BrandLogo variant="regular" height={32} alt="" className="hidden desktop:block" />
    </Link>
  </header>
);
