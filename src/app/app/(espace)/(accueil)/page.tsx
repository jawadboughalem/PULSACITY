import type { Metadata } from "next";
import Link from "next/link";
import { CopyLinkField } from "@/components/space/CopyLinkField";
import { ShareLinkButton } from "@/components/space/ShareLinkButton";
import { SYSTEME_CONNECTOR_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { buildCollectionUrl } from "@/lib/app-url";
import { cn } from "@/lib/cn";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { getCurrentSpaceCounts } from "@/lib/spaces/get-current-space-counts";

export const metadata: Metadata = {
  title: "Accueil · PULSACITY",
};

const EMPTY_STATE_TITLE = "Pas encore de témoignage";
const EMPTY_STATE_TEXT =
  "Envoyez votre lien à vos clients, ou connectez Systeme.io pour qu'une demande parte après chaque vente.";

const SpaceHomePage = async () => {
  const { space } = await getCurrentSpace();
  const counts = await getCurrentSpaceCounts(space.id);
  const collectionUrl = buildCollectionUrl(space.slug);
  const hasNoTestimonial = counts.total === 0;

  return (
    <main className="flex flex-col gap-5 px-5 pt-6 pb-[108px] desktop:gap-7 desktop:px-8 desktop:py-7">
      <div className="hidden flex-col gap-2 desktop:flex">
        <h1 className="font-serif text-h1 font-medium">Bienvenue</h1>
        <p className="text-body text-slate-600">{`Votre espace ${space.name} est prêt.`}</p>
      </div>
      <section className="hidden flex-col gap-6 border-y border-t-ink-900 border-b-hairline-200 py-8 desktop:flex">
        {hasNoTestimonial ? (
          <div className="flex max-w-text flex-col gap-4">
            <h2 className="font-serif text-h1 font-medium">{EMPTY_STATE_TITLE}</h2>
            <p className="text-body">{EMPTY_STATE_TEXT}</p>
          </div>
        ) : null}
        <CopyLinkField url={collectionUrl} />
        <div className="flex items-center gap-4">
          <span className="text-body text-slate-600">ou</span>
          <Link href={SYSTEME_CONNECTOR_HREF} className={SECONDARY_BUTTON_CLASSES}>
            <Icon name="connection" size={20} />
            Connecter Systeme.io
          </Link>
        </div>
      </section>
      <div className="flex flex-col gap-5 desktop:hidden">
        {hasNoTestimonial ? (
          <>
            <p className="text-body text-slate-600">{`Bienvenue, votre espace ${space.name} est prêt.`}</p>
            <h1 className="border-t border-ink-900 pt-5 font-serif text-h1 font-medium">{EMPTY_STATE_TITLE}</h1>
            <p className="text-body">{EMPTY_STATE_TEXT}</p>
          </>
        ) : (
          <h1 className="text-body text-slate-600">{`Bienvenue, votre espace ${space.name} est prêt.`}</h1>
        )}
        <div className="flex flex-col gap-3">
          <ShareLinkButton url={collectionUrl} />
          <Link href={SYSTEME_CONNECTOR_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
            <Icon name="connection" size={20} />
            Connecter Systeme.io
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SpaceHomePage;
