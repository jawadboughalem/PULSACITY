"use client";

import { useEffect, useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_HINT_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/lib/cn";
import { formatDateAtHour } from "@/lib/dates/format-french-date";
import { ACCOUNT_EXPORT_PATH } from "@/lib/spaces/account-paths";

type ExportState =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "ready"; url: string; fileName: string; preparedAt: Date }
  | { status: "failed" };

const FALLBACK_FILE_NAME = "pulsacity-donnees.json";

const readFileName = (response: Response) =>
  response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? FALLBACK_FILE_NAME;

/**
 * Mon compte, « Exporter mes données »: the file is prepared on demand, then kept in the page until it is saved. It
 * never stays on our side.
 */
export const ExportSection = () => {
  const [state, setState] = useState<ExportState>({ status: "idle" });

  useEffect(() => {
    if (state.status !== "ready") return;
    return () => URL.revokeObjectURL(state.url);
  }, [state]);

  const prepare = async () => {
    setState({ status: "preparing" });
    try {
      const response = await fetch(ACCOUNT_EXPORT_PATH, { cache: "no-store" });
      if (!response.ok) throw new Error(`Export answered ${response.status}`);
      const file = await response.blob();
      setState({ status: "ready", url: URL.createObjectURL(file), fileName: readFileName(response), preparedAt: new Date() });
    } catch {
      setState({ status: "failed" });
    }
  };

  return (
    <SettingsSection id="account-export" title="Exporter mes données">
      <p className={FIELD_HINT_CLASSES}>
        Un fichier avec votre espace, vos offres, vos clients, vos ventes, vos demandes, et vos témoignages avec la preuve de
        leur consentement.
      </p>
      {state.status === "idle" ? (
        <button type="button" onClick={prepare} className={cn(SECONDARY_COMPACT_BUTTON_CLASSES, "self-start")}>
          <Icon name="download" size={20} />
          Préparer le fichier
        </button>
      ) : null}
      {state.status === "preparing" ? (
        <StatusBanner tone="waiting" title="Préparation de votre fichier…">
          Restez sur cette page le temps de le préparer.
        </StatusBanner>
      ) : null}
      {state.status === "ready" ? (
        <>
          <StatusBanner tone="success" title="Votre fichier est prêt.">
            {`Préparé le ${formatDateAtHour(state.preparedAt)}.`}
          </StatusBanner>
          <a href={state.url} download={state.fileName} className={cn(PRIMARY_BUTTON_CLASSES, "self-start max-desktop:w-full")}>
            <Icon name="download" size={20} />
            Télécharger le fichier
          </a>
        </>
      ) : null}
      {state.status === "failed" ? (
        <StatusBanner tone="error" title="Le fichier n'a pas pu être préparé.">
          <div className="flex flex-col items-start gap-3">
            <p>Rien n&apos;est perdu. Réessayez ; si cela se reproduit, écrivez-nous.</p>
            <button type="button" onClick={prepare} className={SECONDARY_COMPACT_BUTTON_CLASSES}>
              <Icon name="replay" size={20} />
              Réessayer
            </button>
          </div>
        </StatusBanner>
      ) : null}
    </SettingsSection>
  );
};
