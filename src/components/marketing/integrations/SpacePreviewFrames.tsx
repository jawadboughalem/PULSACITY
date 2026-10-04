import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** A field of the space, read-only: one line, cut with « … » when the window is narrow. */
const FIELD_CLASSES =
  "block h-[48px] min-w-[0] truncate rounded-sm border border-gray-400 bg-paper-100 px-4 text-body leading-[46px] desktop:flex-1";

const BUTTON_CLASSES = "flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-sm px-5 text-body font-semibold";

type SpaceFrameProps = {
  /** Read instead of the drawing: what the creator will see there. */
  label: string;
  children: ReactNode;
};

/** A part of the creator's space, in a window of the site (m21): « Votre espace · Connecteurs › Systeme.io ». */
const SpaceFrame = ({ label, children }: SpaceFrameProps) => (
  <div role="img" aria-label={label} className="border border-hairline-200 bg-white desktop:max-w-[562px]">
    <div className="flex h-[36px] items-center gap-2 border-b border-hairline-200 px-3 text-legal text-slate-600">
      <span className="flex gap-1">
        {[1, 2, 3].map((dot) => (
          <span key={dot} className="size-[8px] rounded-full bg-hairline-200" />
        ))}
      </span>
      <span className="ml-3 truncate">Votre espace · Connecteurs › Systeme.io</span>
    </div>
    <div className="p-4 desktop:p-5">{children}</div>
  </div>
);

/** Step 2 of m21: the address and the secret of the connection, each with its « Copier ». */
export const ConnectionAddressFrame = () => (
  <SpaceFrame label="Dans votre espace : l'adresse de connexion et la clé secrète, chacune avec un bouton Copier.">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-small font-semibold">Adresse de connexion</span>
        <span className="flex flex-col gap-3 desktop:flex-row desktop:gap-3">
          <span className={FIELD_CLASSES}>[adresse de connexion propre à votre espace]</span>
          <span className={cn(BUTTON_CLASSES, "bg-ink-900 text-white")}>
            <Icon name="copy" size={20} />
            Copier
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-small font-semibold">Clé secrète</span>
        <span className="flex flex-col gap-3 desktop:flex-row desktop:gap-3">
          <span className={FIELD_CLASSES}>••••••••••••••••••••</span>
          <span className={cn(BUTTON_CLASSES, "border border-ink-900 bg-white")}>Copier</span>
        </span>
      </div>
    </div>
  </SpaceFrame>
);

/** Step 4 of m21: the light of the Systeme.io page once the test sale has arrived. */
export const ConnectionSuccessFrame = () => (
  <SpaceFrame label="Dans votre espace : « Connecté — dernière vente reçue il y a 3 min. Tout fonctionne. »">
    <div className="flex items-start gap-3 bg-success-surface p-4">
      <Icon name="valid" size={20} className="mt-[2px] shrink-0 text-success" />
      <span className="flex flex-col gap-1">
        <span className="text-body font-semibold text-success">Connecté — dernière vente reçue il y a 3 min</span>
        <span className="text-small">Tout fonctionne. Vous n&apos;avez plus rien à faire ici.</span>
      </span>
    </div>
  </SpaceFrame>
);
