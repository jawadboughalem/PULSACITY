import Link from "next/link";
import { CopyLinkField } from "@/components/space/CopyLinkField";
import { ShareLinkButton } from "@/components/space/ShareLinkButton";
import { SYSTEME_CONNECTOR_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { FirstDaySymbol } from "./FirstDaySymbol";

export const FIRST_DAY_TITLE = "Pas encore de témoignage";

export const FIRST_DAY_TEXT =
  "Envoyez votre lien à vos clients, ou connectez Systeme.io pour qu'une demande parte après chaque vente.";

type FirstDayProps = {
  firstName: string | null;
  collectionUrl: string;
  shouldTakeOff: boolean;
};

export const FirstDay = ({ firstName, collectionUrl, shouldTakeOff }: FirstDayProps) => (
  <>
    <div className="hidden flex-col gap-2 desktop:flex">
      <h1 className="font-serif text-h1 font-medium">{firstName ? `Bienvenue ${firstName}` : "Bienvenue"}</h1>
      <p className="text-body text-slate-600">Votre espace est prêt.</p>
    </div>
    <p className="text-body text-slate-600 desktop:hidden">
      {firstName ? `Bienvenue ${firstName}, votre espace est prêt.` : "Bienvenue, votre espace est prêt."}
    </p>
    <section
      aria-labelledby="first-day"
      className="flex flex-col gap-5 border-t border-ink-900 pt-5 desktop:gap-6 desktop:border-b desktop:border-b-hairline-200 desktop:py-8"
    >
      <div className="flex max-w-text flex-col gap-4">
        <FirstDaySymbol shouldTakeOff={shouldTakeOff} />
        <h2 id="first-day" className="font-serif text-h1 font-medium">
          {FIRST_DAY_TITLE}
        </h2>
        <p className="text-body">{FIRST_DAY_TEXT}</p>
      </div>
      <div className="hidden flex-col gap-6 desktop:flex">
        <CopyLinkField url={collectionUrl} />
        <div className="flex items-center gap-4">
          <span className="text-body text-slate-600">ou</span>
          <Link href={SYSTEME_CONNECTOR_HREF} className={SECONDARY_BUTTON_CLASSES}>
            <Icon name="connection" size={20} />
            Connecter Systeme.io
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 desktop:hidden">
        <ShareLinkButton url={collectionUrl} />
        <Link href={SYSTEME_CONNECTOR_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full")}>
          <Icon name="connection" size={20} />
          Connecter Systeme.io
        </Link>
      </div>
    </section>
  </>
);
