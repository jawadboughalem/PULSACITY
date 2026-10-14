"use client";

import Link from "next/link";
import { useCopyLink } from "@/components/space/useCopyLink";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { StatusBanner } from "@/components/ui/StatusBanner";
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

/** Maquette 5, the light at the top of the page: waiting, connected, or a problem to fix, as the charter's banners. */
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
      <StatusBanner
        tone="waiting"
        title={isOne ? "1 vente gardée de côté" : `${setAsideCount} ventes gardées de côté`}
        icon={<Icon name="alert" size={24} className="mt-[1px] shrink-0 text-waiting" />}
      >
        {isOne ? "Elle est arrivée avec une autre clé secrète. Rien n'est perdu" : "Elles sont arrivées avec une autre clé secrète. Rien n'est perdu"}
        <span className="desktop:hidden">.</span>
        <span className="hidden desktop:inline">
          {isOne
            ? " : corrigez la clé, puis rejouez-la depuis les événements."
            : " : corrigez la clé, puis rejouez-les depuis les événements."}
        </span>
      </StatusBanner>
    );
  }

  if (status === "active") {
    return (
      <StatusBanner tone="success" title={lastEventSince ? `Connecté — dernière vente reçue ${lastEventSince}` : "Connecté"}>
        Tout fonctionne. Vous n&apos;avez plus rien à faire ici.
      </StatusBanner>
    );
  }

  if (status === "error") {
    return (
      <StatusBanner tone="error" title="Problème de connexion">
        <div className="flex flex-col gap-3">
          <p className="max-w-text">
            {`${problemSince ? `Depuis ${problemSince}, ` : ""}${connectorName} nous envoie vos ventes avec une clé secrète qui ne correspond plus. Aucune vente n'est perdue : nous les gardons de côté.`}
          </p>
          <div className="flex flex-col gap-1">
            <p className="font-bold">À faire :</p>
            <p className="max-w-text">
              {`Copiez la clé secrète ci-dessous, puis collez-la à nouveau dans ${connectorName}, dans le webhook ${quoteInFrench("PULSACITY")}.`}
            </p>
          </div>
          {/* Charte v2: an error banner's action is a secondary button; the page keeps its one main button. */}
          <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
            <button type="button" onClick={handleCopy} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
              <Icon name={isCopied ? "valid" : "copy"} size={20} />
              {isCopied ? "Clé secrète copiée" : "Copier la clé secrète"}
            </button>
            <Link href={`#${stepTwoId}`} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}>
              Revoir l&apos;étape 2
            </Link>
          </div>
        </div>
      </StatusBanner>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-card bg-sky px-5 py-4 text-ink desktop:flex-row desktop:items-center desktop:justify-between desktop:px-6 desktop:py-5"
    >
      <div className="flex items-start gap-[14px]">
        <Icon name="clock" size={24} className="mt-[1px] shrink-0" />
        <div className="flex min-w-[0] flex-col gap-1">
          <p className="text-body font-bold">En attente de votre première vente…</p>
          <p className="text-small">
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
