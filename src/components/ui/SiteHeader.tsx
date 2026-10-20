import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "./button-styles";

/**
 * The header of the pages without the site's menu (sign-in, onboarding, errors): white, 64 high, 88 on a computer. The
 * first steps of the space put « Se déconnecter » at its right.
 */
export const SiteHeader = ({ action }: { action?: ReactNode }) => (
  <header className="flex h-[64px] shrink-0 items-center justify-between gap-4 bg-white px-page-gutter desktop:h-[88px]">
    <Link href="/" aria-label="Pulsacity, accueil" className={cn("rounded-field", FOCUS_RING)}>
      <BrandLogo variant="small" height={24} alt="" className="desktop:hidden" />
      <BrandLogo variant="regular" height={32} alt="" className="hidden desktop:block" />
    </Link>
    {action}
  </header>
);
