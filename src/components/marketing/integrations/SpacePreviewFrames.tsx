import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** A field of the space, read-only (charte v2: on Nuage, its 2 px Gris border): one line, cut with « … » when narrow. */
const FIELD_CLASSES =
  "block h-[56px] min-w-[0] truncate rounded-field border-2 border-gray bg-cloud px-4 text-body leading-[52px] desktop:flex-1";

const ADDRESS_LABEL = "Dans votre espace : l'adresse de connexion et la clé secrète, chacune avec un bouton Copier.";

const ADDRESS_ONLY_LABEL = "Dans votre espace : l'adresse de connexion, avec un bouton Copier.";

/** The space's « Copier » buttons, drawn: the address's is the main one (Soleil), the key's the secondary one. */
const BUTTON_CLASSES = "flex shrink-0 items-center justify-center gap-2 rounded-full text-body font-bold text-ink";

type SpaceFrameProps = {
  /** Read instead of the drawing: what the creator will see there. */
  label: string;
  /** The page of the space it shows: « Connecteurs › Systeme.io ». */
  connectorName: string;
  children: ReactNode;
};

/**
 * A part of the creator's space, in a window of the site (maquettes 3.5): « Votre espace · Connecteurs › Systeme.io ».
 * A white window, its bar on Ciel, in a Nuage frame, like the other drawings of the steps.
 */
const SpaceFrame = ({ label, connectorName, children }: SpaceFrameProps) => (
  <div role="img" aria-label={label} className="rounded-card bg-cloud p-3 desktop:max-w-[708px]">
    <div className="overflow-hidden rounded-field bg-white">
      <div className="flex h-[36px] items-center gap-2 bg-sky px-3 text-legal text-gray">
        <span className="flex gap-1">
          {[1, 2, 3].map((dot) => (
            <span key={dot} className="size-[8px] rounded-full bg-white" />
          ))}
        </span>
        <span className="ml-3 truncate">{`Votre espace · Connecteurs › ${connectorName}`}</span>
      </div>
      <div className="p-4 desktop:p-6">{children}</div>
    </div>
  </div>
);

type ConnectionFrameProps = {
  connectorName: string;
  /** The universal connector has no secret key: its address alone authenticates the sales. */
  hasSigningKey?: boolean;
};

/** Step 2 of m21: the address and the secret of the connection, each with its « Copier ». */
export const ConnectionAddressFrame = ({ connectorName, hasSigningKey = true }: ConnectionFrameProps) => (
  <SpaceFrame connectorName={connectorName} label={hasSigningKey ? ADDRESS_LABEL : ADDRESS_ONLY_LABEL}>
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-small font-bold">Adresse de connexion</span>
        <span className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-3">
          <span className={FIELD_CLASSES}>https://pulsacity.com/api/connectors/••••••••••••</span>
          <span className={cn(BUTTON_CLASSES, "h-[56px] bg-sun px-7")}>
            <Icon name="copy" size={20} />
            Copier
          </span>
        </span>
      </div>
      {hasSigningKey ? (
        <div className="flex flex-col gap-2">
          <span className="text-small font-bold">Clé secrète</span>
          <span className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:gap-3">
            <span className={FIELD_CLASSES}>••••••••••••••••••••</span>
            <span className={cn(BUTTON_CLASSES, "h-[52px] border-2 border-ink bg-white px-6")}>Copier</span>
          </span>
        </div>
      ) : null}
    </div>
  </SpaceFrame>
);

/** Step 4 of m21: the light of the connector's page once the test sale has arrived. */
export const ConnectionSuccessFrame = ({ connectorName }: Pick<ConnectionFrameProps, "connectorName">) => (
  <SpaceFrame connectorName={connectorName} label="Dans votre espace : « Connecté — dernière vente reçue il y a 3 min. Tout fonctionne. »">
    <div className="flex items-start gap-[14px] rounded-card bg-success-surface px-5 py-4">
      <Icon name="valid" size={24} className="mt-[1px] shrink-0 text-success" />
      <span className="flex flex-col gap-1">
        <span className="text-body font-bold">Connecté — dernière vente reçue il y a 3 min</span>
        <span className="text-small">Tout fonctionne. Vous n&apos;avez plus rien à faire ici.</span>
      </span>
    </div>
  </SpaceFrame>
);
