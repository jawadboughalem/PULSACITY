import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/app/sign-out-action";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { ACCOUNT_SECTIONS, MORE_SECTIONS, type SpaceSection } from "@/components/space/space-sections";
import { FOCUS_RING, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { cn } from "@/lib/cn";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Plus · PULSACITY",
};

/** Charte v2, page « Plus »: rows of 56 with their icon 24 and a Gris chevron 20, no rule; Ciel when hovered. */
const ROW_CLASSES = `pz-couleur flex min-h-[56px] items-center gap-4 rounded-field px-4 text-body text-ink hover:bg-sky ${FOCUS_RING}`;

/** Groups on white cards, radius-card, padding 8. */
const GROUP_CLASSES = "flex flex-col rounded-card bg-white p-2";

/** The intertitles: 15/22 700 Gris. */
const GROUP_TITLE_CLASSES = "px-2 text-small font-bold text-gray";

const SectionLinks = ({ sections }: { sections: SpaceSection[] }) => (
  <>
    {sections.map((section) => (
      <li key={section.label}>
        <Link href={section.href} className={ROW_CLASSES}>
          <Icon name={section.icon} size={24} />
          <span className="flex-1">{section.label}</span>
          <Icon name="chevronRight" size={20} className="text-gray" />
        </Link>
      </li>
    ))}
  </>
);

const MorePage = async () => {
  const { signedInUser, space } = await getCurrentSpace();
  const account = buildSpaceAccount(signedInUser, space);

  return (
    <>
      <SpaceMobileHeader account={account} />
      <SpacePage className="desktop:max-w-[calc(var(--container-text)+112px)]">
        <h1 className="font-display text-h1">Plus</h1>
        <section aria-labelledby="more-space" className="flex flex-col gap-3">
          <h2 id="more-space" className={GROUP_TITLE_CLASSES}>
            Votre espace
          </h2>
          <ul className={GROUP_CLASSES}>
            <SectionLinks sections={MORE_SECTIONS} />
          </ul>
        </section>
        <section aria-labelledby="more-account" className="flex flex-col gap-3">
          <h2 id="more-account" className={GROUP_TITLE_CLASSES}>
            Votre compte
          </h2>
          <ul className={GROUP_CLASSES}>
            <li className="flex items-center gap-4 px-4 py-4">
              <SpaceAvatar name={account.name} logoUrl={account.logoUrl} size={44} background="sky" />
              <div className="flex min-w-[0] flex-col">
                <strong className="truncate text-body font-bold">{account.name}</strong>
                <span className="truncate text-small text-gray">{account.email}</span>
                <span className="text-legal text-gray">{`Plan ${account.planName}`}</span>
              </div>
            </li>
            <SectionLinks sections={ACCOUNT_SECTIONS} />
          </ul>
        </section>
        <form action={signOut}>
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
