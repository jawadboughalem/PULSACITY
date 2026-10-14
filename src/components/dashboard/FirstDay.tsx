import Link from "next/link";
import { CopyLinkField } from "@/components/space/CopyLinkField";
import { ShareLinkButton } from "@/components/space/ShareLinkButton";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { FirstDaySymbol } from "./FirstDaySymbol";

export const FIRST_DAY_TITLE = "Pas encore de témoignage";

export const FIRST_DAY_TEXT =
  "Envoyez votre lien à vos clients, ou connectez l'outil où vous vendez pour qu'une demande parte après chaque vente.";

type FirstDayProps = {
  firstName: string | null;
  collectionUrl: string;
  shouldTakeOff: boolean;
};

export const FirstDay = ({ firstName, collectionUrl, shouldTakeOff }: FirstDayProps) => (
  <>
    <div className="hidden flex-col gap-2 desktop:flex">
      <h1 className="font-display text-h1">{firstName ? `Bienvenue ${firstName}` : "Bienvenue"}</h1>
      <p className="text-body text-gray">Votre espace est prêt.</p>
    </div>
    <p className="text-body text-gray desktop:hidden">
      {firstName ? `Bienvenue ${firstName}, votre espace est prêt.` : "Bienvenue, votre espace est prêt."}
    </p>
    <section
      aria-labelledby="first-day"
      className="flex flex-col gap-6 rounded-panel bg-white p-6 desktop:gap-8 desktop:p-12"
    >
      <div className="flex max-w-text flex-col gap-4">
        <FirstDaySymbol shouldTakeOff={shouldTakeOff} />
        <h2 id="first-day" className="font-display text-h1">
          {FIRST_DAY_TITLE}
        </h2>
        <p className="text-body">{FIRST_DAY_TEXT}</p>
      </div>
      <div className="hidden flex-col gap-8 desktop:flex">
        <CopyLinkField url={collectionUrl} />
        <div className="flex items-center gap-4">
          <span className="text-body text-gray">ou</span>
          <Link href={CONNECTORS_SECTION_HREF} className={SECONDARY_BUTTON_CLASSES}>
            <Icon name="connection" size={20} />
            Connecter mon outil
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 desktop:hidden">
        <ShareLinkButton url={collectionUrl} />
        <Link href={CONNECTORS_SECTION_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
          <Icon name="connection" size={20} />
          Connecter mon outil
        </Link>
      </div>
    </section>
  </>
);
