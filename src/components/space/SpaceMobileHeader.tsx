import { Logotype } from "@/components/ui/Logotype";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";

type SpaceMobileHeaderProps = {
  spaceName: string;
  logoUrl: string | null;
};

export const SpaceMobileHeader = ({ spaceName, logoUrl }: SpaceMobileHeaderProps) => (
  <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-hairline-200 pr-4 pl-5">
    <Logotype className="text-logo-22" />
    <span className="flex size-[44px] items-center justify-center">
      <SpaceAvatar name={spaceName} logoUrl={logoUrl} size={36} background="paper" />
    </span>
  </header>
);
