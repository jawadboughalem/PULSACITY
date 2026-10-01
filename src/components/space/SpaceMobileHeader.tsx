import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import type { SpaceAccount } from "./SpaceAccount";

type SpaceMobileHeaderProps = {
  account: SpaceAccount;
};

export const SpaceMobileHeader = ({ account }: SpaceMobileHeaderProps) => (
  <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-hairline-200 pr-4 pl-5 desktop:hidden">
    <BrandLogo variant="small" height={24} alt="Pulsacity" />
    <Link
      href="/app/plus"
      aria-label="Votre compte"
      className="flex size-[44px] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      <SpaceAvatar name={account.name} logoUrl={account.logoUrl} size={36} background="paper" />
    </Link>
  </header>
);
