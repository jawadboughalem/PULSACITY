import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/app/sign-out-action";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { ACCOUNT_SECTIONS, MORE_SECTIONS, type SpaceSection } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Plus · PULSACITY",
};

const ROW_CLASSES =
  "flex min-h-[56px] items-center gap-4 border-b border-hairline-200 py-3 text-body hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

const SectionLinks = ({ sections }: { sections: SpaceSection[] }) => (
  <ul className="flex flex-col">
    {sections.map((section) => (
      <li key={section.label}>
        <Link href={section.href} className={ROW_CLASSES}>
          <Icon name={section.icon} size={24} />
          <span className="flex-1">{section.label}</span>
          <Icon name="chevronRight" size={20} className="text-slate-600" />
        </Link>
      </li>
    ))}
  </ul>
);

const MorePage = async () => {
  const { signedInUser, space } = await getCurrentSpace();
  const account = buildSpaceAccount(signedInUser, space);

  return (
    <>
    <SpaceMobileHeader account={account} />
    <SpacePage className="desktop:max-w-text">
      <h1 className="font-serif text-h1 font-medium">Plus</h1>
      <section aria-labelledby="more-space" className="flex flex-col">
        <h2 id="more-space" className="border-b border-ink-900 pb-3 text-small font-semibold text-slate-600">
          Votre espace
        </h2>
        <SectionLinks sections={MORE_SECTIONS} />
      </section>
      <section aria-labelledby="more-account" className="flex flex-col pt-5">
        <h2 id="more-account" className="border-b border-ink-900 pb-3 text-small font-semibold text-slate-600">
          Votre compte
        </h2>
        <div className="flex items-center gap-4 border-b border-hairline-200 py-4">
          <SpaceAvatar name={account.name} logoUrl={account.logoUrl} size={44} background="paper" />
          <div className="flex min-w-[0] flex-col">
            <strong className="truncate text-body font-semibold">{account.name}</strong>
            <span className="truncate text-small text-slate-600">{`${account.email} · Plan ${account.planName}`}</span>
          </div>
        </div>
        <SectionLinks sections={ACCOUNT_SECTIONS} />
      </section>
      <form action={signOut} className="pt-5">
        <button type="submit" className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
          <Icon name="logout" size={20} />
          Se déconnecter
        </button>
      </form>
    </SpacePage>
    </>
  );
};

export default MorePage;
