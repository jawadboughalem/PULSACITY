import type { Metadata } from "next";
import Link from "next/link";
import { MARKETING_PATHS } from "@/components/marketing/marketing-paths";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Votre espace est supprimé · PULSACITY",
  robots: { index: false, follow: false },
};

/** A bubble with its check, and the Corail dot: the illustration of 3.3 (simple shapes, flat colours). */
const DeletedIllustration = () => (
  <svg width="100" height="96" viewBox="0 0 100 96" aria-hidden="true" className="h-[96px] w-[100px]">
    <path d="M14 0h64a14 14 0 0 1 14 14v42a14 14 0 0 1-14 14H36L14 90V70A14 14 0 0 1 0 56V14A14 14 0 0 1 14 0z" className="fill-sky" />
    <path d="M30 35l10 10 20-20" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="stroke-ink" />
    <circle cx="86" cy="82" r="12" className="fill-coral" />
  </svg>
);

/** After « Supprimer mon espace » (3.3): the creator is signed out; nothing of the space is shown any more. */
const SpaceDeletedPage = () => (
  <div className="px-page-gutter pt-12 pb-14 desktop:pt-14 desktop:pb-14">
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
      <DeletedIllustration />
      <div className="flex max-w-[640px] flex-col gap-4">
        <h1 className="font-display text-h1">Votre espace est supprimé.</h1>
        <p className="text-lead">
          Votre session est fermée. Vos témoignages ne s&apos;affichent plus, et plus aucun prélèvement ne sera fait.
        </p>
        <p className="text-small text-gray">Vos factures restent disponibles : écrivez-nous si vous en avez besoin.</p>
      </div>
      <div className="flex w-full flex-col items-start gap-4 desktop:w-auto desktop:flex-row desktop:items-center">
        <Link href={MARKETING_PATHS.home} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
          Revenir à l&apos;accueil
        </Link>
        <Link href={MARKETING_PATHS.contact} className={cn(DISCREET_BUTTON_CLASSES, "max-desktop:-ml-[10px]")}>
          Écrivez-nous
        </Link>
      </div>
    </div>
  </div>
);

export default SpaceDeletedPage;
