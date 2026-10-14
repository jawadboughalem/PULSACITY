import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import type { SpaceAccount } from "./SpaceAccount";

type SpaceMobileHeaderProps = {
  account: SpaceAccount;
};

/** Charte v2, the space on a phone: a white header of 64, the small logo at 24, the avatar 44 that leads to « Plus ». */
export const SpaceMobileHeader = ({ account }: SpaceMobileHeaderProps) => (
  <header className="flex h-[64px] shrink-0 items-center justify-between bg-white pr-3 pl-5 desktop:hidden">
    <BrandLogo variant="small" height={24} alt="Pulsacity" />
    <Link href="/app/plus" aria-label="Votre compte" className={cn("flex rounded-full", FOCUS_RING)}>
      <SpaceAvatar name={account.name} logoUrl={account.logoUrl} size={44} background="sky" />
    </Link>
  </header>
);
