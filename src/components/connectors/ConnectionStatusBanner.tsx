"use client";

import { useCopyLink } from "@/components/space/useCopyLink";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { useConnectionCheck } from "./useConnectionCheck";

type ConnectionStatusBannerProps = {
  status: "pending" | "active" | "error";
  connectorName: string;
  /** « il y a 3 min » */
  lastEventSince: string | null;
  /** « hier à 18:42 » */
  problemSince: string | null;
  signingSecret: string | null;
  stepTwoId: string;
  /** Sales signed with another key, waiting for « Rejouer » once the connection works again. */
  setAsideCount: number;
};

export const CHECK_HINT = "Toujours rien reçu. Vérifiez les étapes 1 et 2, puis faites un achat test.";

/** Maquette 5, the light at the top of the page: waiting, connected, or a problem to fix. */
export const ConnectionStatusBanner = ({
  status,
  connectorName,
  lastEventSince,
  problemSince,
  signingSecret,
  stepTwoId,
  setAsideCount,
}: ConnectionStatusBannerProps) => {
  const { check, isChecking, hasChecked } = useConnectionCheck(status === "pending");
  const { isCopied, handleCopy } = useCopyLink(signingSecret ?? "");

  if (status === "active" && setAsideCount > 0) {
    const isOne = setAsideCount === 1;
    return (
      <div role="status" className="flex items-start gap-4 bg-attention-surface p-4 desktop:p-5">
        <Icon name="alert" size={24} className="shrink-0 text-attention" />
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold text-attention">
            {isOne ? "1 vente gardée de côté" : `${setAsideCount} ventes gardées de côté`}
          </p>
          <p className="text-small">
            {isOne ? "Elle est arrivée avec une autre clé secrète. Rien n'est perdu" : "Elles sont arrivées avec une autre clé secrète. Rien n'est perdu"}
            <span className="desktop:hidden">.</span>
            <span className="hidden desktop:inline">
              {isOne
                ? " : corrigez la clé, puis rejouez-la depuis les événements."
                : " : corrigez la clé, puis rejouez-les depuis les événements."}
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div role="status" className="flex items-start gap-4 bg-success-surface p-4 desktop:p-5">
        <Icon name="valid" size={24} className="text-success" />
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold text-success">
            {lastEventSince ? `Connecté — dernière vente reçue ${lastEventSince}` : "Connecté"}
          </p>
          <p className="text-small">Tout fonctionne. Vous n&apos;avez plus rien à faire ici.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="flex items-start gap-4 border-2 border-error bg-error-surface p-4 desktop:p-5">
        <Icon name="alert" size={24} className="text-error" />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-body font-semibold text-error">Problème de connexion</p>
            <p className="max-w-text text-small">
              {`${problemSince ? `Depuis ${problemSince}, ` : ""}${connectorName} nous envoie vos ventes avec une clé secrète qui ne correspond plus. Aucune vente n'est perdue : nous les gardons de côté.`}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-small font-semibold">À faire :</p>
            <p className="max-w-text text-small">
              {`Copiez la clé secrète ci-dessous, puis collez-la à nouveau dans ${connectorName}, dans le webhook ${quoteInFrench("PULSACITY")}.`}
            </p>
          </div>
          <div className="flex flex-col gap-3 desktop:flex-row">
            <button type="button" onClick={handleCopy} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
              <Icon name={isCopied ? "valid" : "copy"} size={20} />
              {isCopied ? "Clé secrète copiée" : "Copier la clé secrète"}
            </button>
            <a href={`#${stepTwoId}`} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
              Revoir l&apos;étape 2
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-col gap-4 bg-paper-100 p-4 desktop:flex-row desktop:items-center desktop:justify-between desktop:p-5"
    >
      <div className="flex items-start gap-4">
        <Icon name="clock" size={24} />
        <div className="flex flex-col gap-1">
          <p className="text-body font-semibold">En attente de votre première vente…</p>
          <p className="text-small text-slate-600">
            {hasChecked ? CHECK_HINT : "Rien à faire si les étapes 1 et 2 sont faites. Pour vérifier tout de suite, faites un achat test."}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={check}
        disabled={isChecking}
        className={cn(SECONDARY_BUTTON_CLASSES, "w-full shrink-0 desktop:w-auto")}
      >
        Vérifier la connexion
      </button>
    </div>
  );
};
