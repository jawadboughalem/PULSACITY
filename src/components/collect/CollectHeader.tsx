import { SpaceAvatar } from "@/components/ui/SpaceAvatar";

type CollectHeaderProps = {
  spaceName: string;
  logoUrl: string | null;
};

export const CollectHeader = ({ spaceName, logoUrl }: CollectHeaderProps) => (
  <header className="flex items-center gap-3">
    <SpaceAvatar name={spaceName} logoUrl={logoUrl} size={44} background="white" />
    <p className="text-body font-semibold">{spaceName}</p>
  </header>
);
