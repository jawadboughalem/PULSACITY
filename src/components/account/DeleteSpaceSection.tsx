"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { deleteMySpace } from "@/app/app/(espace)/compte/account-actions";
import { SettingsSection } from "@/components/settings/SettingsSection";
import {
  DANGER_BUTTON_CLASSES,
  DANGER_OUTLINE_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/components/ui/button-styles";
import { DialogCloseButton } from "@/components/ui/DialogCloseButton";
import { DIALOG_ACTIONS_CLASSES, DIALOG_CLASSES, DIALOG_TITLE_CLASSES, isClickOnVeil } from "@/components/ui/dialog-styles";
import { FIELD_CLASSES, FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES } from "@/components/ui/field-styles";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/lib/cn";

const CONSEQUENCES = [
  "Vos témoignages, vos offres et vos clients sont effacés.",
  "Vos widgets disparaissent de vos pages de vente.",
  "Votre abonnement s'arrête : plus aucun prélèvement.",
  "Vos factures sont gardées, comme la loi l'impose.",
];

const ERRORS = {
  "subscription-not-stopped": "Votre abonnement n'a pas pu être arrêté, et rien n'est supprimé. Réessayez dans un moment.",
  "name-mismatch": "Le nom ne correspond pas. Écrivez-le à l'identique, puis réessayez.",
  "space-not-found": "Cet espace n'existe plus. Rechargez la page.",
  network: "La suppression n'a pas abouti. Vérifiez votre connexion, puis réessayez.",
} as const;

const ConsequenceList = () => (
  <ul className="flex list-disc flex-col gap-1 pl-5 text-body">
    {CONSEQUENCES.map((consequence) => (
      <li key={consequence}>{consequence}</li>
    ))}
  </ul>
);

type DeleteSpaceSectionProps = {
  spaceName: string;
};

/**
 * Mon compte, « Supprimer mon espace »: what goes, then a window where the creator types the space's name, exactly,
 * before « Supprimer définitivement » can be pressed.
 */
export const DeleteSpaceSection = ({ spaceName }: DeleteSpaceSectionProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const fieldId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [error, setError] = useState<keyof typeof ERRORS | null>(null);
  const [isDeleting, startDeleting] = useTransition();
  const isConfirmed = typedName.trim() === spaceName;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const close = () => {
    if (isDeleting) return;
    setIsOpen(false);
    setTypedName("");
    setError(null);
  };

  return (
    <SettingsSection id="account-delete" title="Supprimer mon espace">
      <ConsequenceList />
      <p className={FIELD_HINT_CLASSES}>L&apos;effacement est immédiat et définitif. Pensez à exporter vos données avant.</p>
      <button type="button" onClick={() => setIsOpen(true)} className={cn(DANGER_OUTLINE_BUTTON_CLASSES, "self-start")}>
        Supprimer mon espace
      </button>
      <dialog
        ref={dialogRef}
        data-ouvert={isOpen}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (isClickOnVeil(event)) close();
        }}
        aria-labelledby={titleId}
        className={DIALOG_CLASSES}
      >
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (!isConfirmed) return;
            setError(null);
            startDeleting(async () => {
              try {
                // Deleted: the action signs out and leads to « Votre espace est supprimé », returning nothing here.
                const result = await deleteMySpace(typedName);
                if (result) setError(result.error);
              } catch {
                setError("network");
              }
            });
          }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className={DIALOG_TITLE_CLASSES}>
              {`Supprimer l'espace ${spaceName} ?`}
            </h2>
            <DialogCloseButton onClick={close} isDisabled={isDeleting} />
          </div>
          <ConsequenceList />
          {error ? <StatusBanner tone="error" title={ERRORS[error]} /> : null}
          <div className="flex flex-col gap-2">
            <label htmlFor={fieldId} className={FIELD_LABEL_CLASSES}>
              {`Pour confirmer, écrivez le nom de votre espace : ${spaceName}`}
            </label>
            <input
              id={fieldId}
              value={typedName}
              onChange={(event) => setTypedName(event.target.value)}
              autoComplete="off"
              autoFocus
              spellCheck={false}
              aria-describedby={`${fieldId}-hint`}
              className={FIELD_CLASSES}
            />
            <p id={`${fieldId}-hint`} className={FIELD_HINT_CLASSES}>
              Le bouton s&apos;active quand le nom est écrit à l&apos;identique.
            </p>
          </div>
          <div className={DIALOG_ACTIONS_CLASSES}>
            <button
              type="button"
              disabled={isDeleting}
              onClick={close}
              className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isConfirmed || isDeleting}
              aria-busy={isDeleting || undefined}
              className={cn(DANGER_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              {isDeleting ? <Spinner size={20} /> : null}
              {isDeleting ? "Suppression…" : "Supprimer définitivement"}
            </button>
          </div>
        </form>
      </dialog>
    </SettingsSection>
  );
};
