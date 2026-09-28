import { Logotype } from "@/components/ui/Logotype";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { SpaceNavigationLinks } from "./SpaceNavigationLinks";

type SpaceNavigationProps = {
  spaceName: string;
  logoUrl: string | null;
  accountEmail: string;
  pendingTestimonials: number;
};

export const SpaceNavigation = ({ spaceName, logoUrl, accountEmail, pendingTestimonials }: SpaceNavigationProps) => (
  <nav
    aria-label="Navigation principale"
    className="sticky top-[0] flex h-dvh w-[248px] shrink-0 flex-col gap-6 border-r border-hairline-200 bg-white px-4 pt-6 pb-5"
  >
    <Logotype className="px-3 text-logo-28" />
    <SpaceNavigationLinks pendingTestimonials={pendingTestimonials} />
    <div className="mt-auto flex items-center gap-3 border-t border-hairline-200 px-3 pt-4">
      <SpaceAvatar name={spaceName} logoUrl={logoUrl} size={44} background="paper" />
      <span className="flex min-w-[0] flex-col">
        <strong className="truncate text-small font-semibold">{spaceName}</strong>
        <span className="truncate text-small text-slate-600">{accountEmail}</span>
      </span>
    </div>
  </nav>
);
